import { useState, useCallback, useMemo } from 'react';

import { Alert } from 'react-native';

import { MESSAGES, EMPTY_STATES, TEXT_FORMATTERS } from '../../constants/home';
import { clearAuthData, getStoredUser } from '../../services/authService';
import { getAllMateriasReviewCounts } from '../../services/reviewService';
import { getGeneralStats } from '../../services/statsService';
import { GeneralStats, Materia, User } from '../../types';

import { useErrorHandler, useLoading } from './useCommon';

export interface ReviewCounts {
  totalTemas: number;
  materiasCounts: Array<{
    materia: Materia;
    count: number;
  }>;
}

interface HomeData {
  user: User | null;
  stats: GeneralStats | null;
  reviewCounts: ReviewCounts;
  loadingStats: boolean;
  loadingReviews: boolean;
}

interface HomeActions {
  loadUser: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadReviewCounts: () => Promise<void>;
  refreshAll: () => Promise<void>;
  handleQuickReview: (navigateToTemas: (id: string, name: string) => void) => void;
  handleChooseReview: (navigateToTemas: (id: string, name: string) => void) => void;
  handleLogout: (resetToLogin: () => void) => void;
}

const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const { handleError } = useErrorHandler();

  const loadUser = useCallback(async () => {
    try {
      const userData = await getStoredUser();
      setUser(userData);
    } catch (error) {
      handleError(error, MESSAGES.errors.loadUser);
    }
  }, [handleError]);

  return { user, loadUser };
};

const useStats = () => {
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const { loading, withLoading } = useLoading();
  const { handleError } = useErrorHandler();

  const loadStats = useCallback(async () => {
    const result = await withLoading(async () => {
      return await getGeneralStats();
    });
    
    if (result) {
      setStats(result);
    } else {
      handleError(null, MESSAGES.errors.loadStats);
    }
  }, [withLoading, handleError]);

  return { stats, loading, loadStats };
};

const useReviewCounts = () => {
  const [reviewCounts, setReviewCounts] = useState<ReviewCounts>(EMPTY_STATES.reviewCounts);
  const { loading, withLoading } = useLoading();
  const { handleError } = useErrorHandler();

  const loadReviewCounts = useCallback(async () => {
    const result = await withLoading(async () => {
      return await getAllMateriasReviewCounts();
    });

    if (result) {
      setReviewCounts(result);
    } else {
      handleError(null, MESSAGES.errors.loadReviews);
    }
  }, [withLoading, handleError]);

  return { reviewCounts, loading, loadReviewCounts };
};

const useReviewActions = (reviewCounts: ReviewCounts) => {
  const hasReviewableItems = useMemo(() => 
    reviewCounts.materiasCounts.length > 0, [reviewCounts.materiasCounts.length]);

  const handleQuickReview = useCallback((navigateToTemas: (id: string, name: string) => void) => {
    if (hasReviewableItems) {
      const firstMateria = reviewCounts.materiasCounts[0].materia;
      navigateToTemas(firstMateria._id, firstMateria.name);
    }
  }, [hasReviewableItems, reviewCounts.materiasCounts]);

  const reviewOptions = useMemo(() => {
    return reviewCounts.materiasCounts.map((item) => ({
      text: `${item.materia.name} (${item.count} ${TEXT_FORMATTERS.temasText(item.count)})`,
      materiaId: item.materia._id,
      materiaName: item.materia.name
    }));
  }, [reviewCounts.materiasCounts]);

  const handleChooseReview = useCallback((navigateToTemas: (id: string, name: string) => void) => {
    const options = reviewOptions.map((option) => ({
      text: option.text,
      onPress: () => navigateToTemas(option.materiaId, option.materiaName)
    }));

    options.push({ 
      text: MESSAGES.reviewChoice.cancel, 
      onPress: () => {} 
    });

    Alert.alert(
      MESSAGES.reviewChoice.title, 
      MESSAGES.reviewChoice.message, 
      options
    );
  }, [reviewOptions]);

  return { handleQuickReview, handleChooseReview };
};

const useLogout = () => {
  const { handleError } = useErrorHandler();

  const handleLogout = useCallback((resetToLogin: () => void) => {
    Alert.alert(
      MESSAGES.logout.title,
      MESSAGES.logout.message,
      [
        { 
          text: MESSAGES.logout.buttons.cancel, 
          style: 'cancel' 
        },
        {
          text: MESSAGES.logout.buttons.confirm,
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAuthData();
              resetToLogin();
            } catch (error) {
              handleError(error, MESSAGES.errors.logout);
            }
          },
        },
      ]
    );
  }, [handleError]);

  return { handleLogout };
};

export const useHomeData = (): HomeData & HomeActions => {
  const { user, loadUser } = useUserData();
  const { stats, loading: loadingStats, loadStats } = useStats();
  const { reviewCounts, loading: loadingReviews, loadReviewCounts } = useReviewCounts();
  const { handleQuickReview, handleChooseReview } = useReviewActions(reviewCounts);
  const { handleLogout } = useLogout();

  const refreshAll = useCallback(async () => {
    await Promise.all([loadStats(), loadReviewCounts()]);
  }, [loadStats, loadReviewCounts]);

  return {
    user,
    stats,
    reviewCounts,
    loadingStats,
    loadingReviews,
    loadUser,
    loadStats,
    loadReviewCounts,
    refreshAll,
    handleQuickReview,
    handleChooseReview,
    handleLogout,
  };
};