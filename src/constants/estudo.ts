export const MESSAGES = {
  loading: '🧠 Preparando estudo...',
  noFlashcards: '📝 Nenhum flashcard encontrado',
  errors: {
    loadFlashcards: 'Não foi possível carregar os flashcards',
    saveStudyResult: 'Erro ao salvar estatística',
    markReviewed: 'Não foi possível salvar a revisão do tema'
  },
  alerts: {
    noFlashcards: {
      title: 'Nenhum flashcard',
      message: 'Este tema não possui flashcards para estudar.'
    },
    studyCompleted: {
      title: 'Estudo Concluído! 🎉',
      message: (stats: { correct: number; incorrect: number; skipped: number }, score: number) => 
        `Performance: ${score}%\n\n` +
        `✅ Acertou: ${stats.correct}\n` +
        `❌ Errou: ${stats.incorrect}\n` +
        `⏭️ Pulou: ${stats.skipped}\n\n` +
        `Como foi estudar este tema?`
    },
    themeReviewed: {
      title: 'Tema Revisado! 🎉',
      message: (score: number, correct: number, total: number, days: number) =>
        `Sua performance: ${score}%\n\n` +
        `✅ Acertou: ${correct}/${total}\n` +
        `🔄 Próxima revisão: ${days} dia${days > 1 ? 's' : ''}`
    },
    restartStudy: {
      title: 'Reiniciar Estudo',
      message: 'Tem certeza que deseja reiniciar o estudo?'
    }
  },
  buttons: {
    ok: 'OK',
    continue: 'Continuar',
    cancel: 'Cancelar',
    restart: 'Reiniciar',
    studyAgain: 'Estudar Novamente',
    difficulties: {
      easy: '🟢 Fácil (revisar em 7 dias)',
      medium: '🟡 Médio (revisar em 3 dias)',
      hard: '🔴 Difícil (revisar amanhã)'
    }
  }
};

export const DIFFICULTY_INTERVALS = {
  facil: 7,
  medio: 3,
  dificil: 1
} as const;

export const UI_TEXTS = {
  header: {
    progress: (current: number, total: number) => `${current} de ${total}`,
    stats: (correct: number, incorrect: number, skipped: number, score?: number) => {
      let text = `✅ ${correct} • ❌ ${incorrect} • ⏭️ ${skipped}`;
      if (score !== undefined) text += ` • 📊 ${score}%`;
      return text;
    }
  },
  card: {
    questionLabel: '❓ Pergunta:',
    answerLabel: '✅ Resposta:',
    revealButton: '👆 Toque para revelar a resposta',
    howDidYouDo: 'Como você se saiu?'
  },
  actions: {
    restart: '🔄 Reiniciar',
    skip: '⏭️ Pular',
    skipThis: '⏭️ Pular esta',
    correct: '✅ Acertei',
    incorrect: '❌ Errei'
  }
};

export const STUDY_RESULTS = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  SKIPPED: 'skipped'
} as const;

export const EMPTY_STATS = {
  correct: 0,
  incorrect: 0,
  skipped: 0
};