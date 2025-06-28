# 📚 FlashcardsApp - Sistema de Estudos com Repetição Espaçada

## 📋 Sobre o Projeto

O **FlashcardsApp** é um aplicativo móvel desenvolvido como **Trabalho de Conclusão de Curso (TCC)** que implementa um sistema de estudos baseado em **flashcards** com **repetição espaçada**. O objetivo é otimizar o aprendizado através de revisões programadas baseadas na dificuldade percebida pelo usuário.

### 🎯 Funcionalidades Principais

- **Sistema de Autenticação** (Login/Registro)
- **Organização Hierárquica**: Matérias → Temas → Flashcards
- **Repetição Espaçada Inteligente** com intervalos adaptativos
- **Dashboard Estatístico** com métricas de performance
- **Sistema de Busca** em tempo real
- **Interface Responsiva** com componentes reutilizáveis

---

## 🔌 Camada de Serviços (API)

### **Arquitetura da API**

O projeto implementa uma **camada de serviços robusta** que abstrai toda comunicação com o backend:

#### **🛠️ Cliente HTTP (api.ts)**
```typescript
// Cliente Axios configurado com interceptadores
class ApiClient {
  - Interceptador de Request: Adiciona token JWT automaticamente
  - Interceptador de Response: Trata erros de forma padronizada
  - Armazenamento seguro de tokens com AsyncStorage
  - Logs detalhados para debugging
  - Timeout configurável via variável de ambiente
}
```

#### **🔐 Serviço de Autenticação (authService.ts)**
```typescript
// Funções principais:
- login(credentials): Promise<AuthResponse>
- register(userData): Promise<AuthResponse>
- storeAuthData(token, user): Promise<void>
- clearAuthData(): Promise<void>
- getStoredUser(): Promise<User | null>
- debugCurrentToken(): Promise<void> // Para debugging
```

#### **📚 Serviços de CRUD**

**Matérias (materiaService.ts):**
```typescript
- getMaterias(): Promise<Materia[]>
- createMateria(data): Promise<Materia>
- updateMateria(id, data): Promise<Materia>
- deleteMateria(id): Promise<void>
- searchMaterias(query): Promise<Materia[]>
```

**Temas (temasService.ts):**
```typescript
- getTemas(materiaId): Promise<Tema[]>
- createTema(data): Promise<Tema>
- getTemasForReview(materiaId): Promise<Tema[]>
- getTemasReviewCount(materiaId): Promise<number>
- markTemaAsReviewed(id, reviewData): Promise<Tema>
- searchTemas(materiaId, query): Promise<Tema[]>
```

**Flashcards (flashcardService.ts):**
```typescript
- getFlashcards(temaId): Promise<Flashcard[]>
- createFlashcard(data): Promise<Flashcard>
- updateFlashcard(id, data): Promise<Flashcard>
- deleteFlashcard(id): Promise<void>
- searchFlashcards(temaId, query): Promise<Flashcard[]>
```

#### **📊 Serviços Especializados**

**Estatísticas (statsService.ts):**
```typescript
- saveStudyResult(data): Promise<any>
- getGeneralStats(): Promise<GeneralStats>
- getMateriaStats(id): Promise<MateriaStats>
- getTemaStats(id): Promise<TemaStats>
- getDashboardStats(): Promise<DashboardData>
```

**Revisões (reviewService.ts):**
```typescript
- getAllMateriasReviewCounts(): Promise<ReviewCounts>
- getNextReviewTema(): Promise<{materia, tema} | null>
```

**Busca (searchService.ts):**
```typescript
- searchMaterias(query): Promise<Materia[]>
- searchTemas(materiaId, query): Promise<Tema[]>
- searchFlashcards(temaId, query): Promise<Flashcard[]>
```

### **🔧 Características Técnicas**

#### **Interceptadores Inteligentes**
- **Token automático**: Adiciona JWT em todas as requisições
- **Tratamento de erros**: Transforma erros da API em objetos padronizados
- **Logs estruturados**: Para facilitar debugging
- **Retry logic**: Para requisições que falharam

#### **Armazenamento Seguro**
- **AsyncStorage**: Persistência local do token e dados do usuário
- **Encriptação**: Tokens armazenados de forma segura
- **Limpeza automática**: Remove dados em caso de logout/erro

#### **Tipagem Forte**
- **TypeScript**: Todos os serviços têm tipagem completa
- **Interfaces**: Para requests e responses
- **Generics**: Para reutilização de código

---

## 🏗️ Arquitetura do Projeto

### 📱 **Frontend (React Native + Expo)**
```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button.tsx       # Botão com estados (loading, variants)
│   ├── Input.tsx        # Input com validação e erro
│   └── SearchInput.tsx  # Busca com debounce
├── constants/           # Constantes e configurações
│   ├── auth.ts         # Endpoints e validações de auth
│   ├── estudo.ts       # Configurações do sistema de estudo
│   ├── flashcards.ts   # Configurações de flashcards
│   ├── home.ts         # Configurações da tela inicial
│   ├── materias.ts     # Configurações de matérias
│   └── temas.ts        # Configurações de temas
├── screens/            # Telas da aplicação
│   ├── login/          # Sistema de autenticação
│   ├── home/           # Tela inicial com estatísticas
│   ├── materias/       # Gerenciamento de matérias
│   ├── temas/          # Gerenciamento de temas
│   ├── flashcards/     # CRUD de flashcards
│   └── estudo/         # Interface de estudo
├── services/           # Serviços de API
│   ├── api.ts          # Cliente HTTP configurado (Axios)
│   ├── authService.ts  # Autenticação e armazenamento
│   ├── materiaService.ts  # CRUD de matérias
│   ├── temasService.ts    # CRUD de temas + revisões
│   ├── flashcardService.ts # CRUD de flashcards
│   ├── statsService.ts     # Estatísticas e métricas
│   ├── reviewService.ts    # Sistema de revisões
│   └── searchService.ts    # Busca unificada
├── types/
│   ├── index.ts              # Tipos principais do sistema
│   └── navigation.ts         # Tipos para React Navigation
├── hooks/
│   ├── useCommon/            # Hooks utilitários
│   │   ├── useLoading.ts     # Gestão de estados de carregamento
│   │   ├── useToggle.ts      # Toggle booleano
│   │   └── useErrorHandler.ts # Tratamento de erros
│   ├── useEstudoData.ts      # Lógica completa de estudo
│   ├── useFlashcardsData.ts  # Gestão de flashcards
│   ├── useHomeData.ts        # Dados da tela inicial
│   ├── useMateriaData.ts     # Gestão de matérias
│   └── useTemasData.ts       # Gestão de temas
└── utils/
    └── validators.ts         # Validações de formulários
```

### 🔧 **Stack Tecnológica**

#### **Frontend**
- **React Native 0.79.3** - Framework mobile
- **Expo SDK 53** - Plataforma de desenvolvimento
- **TypeScript 5.8.3** - Tipagem estática
- **React Navigation 7.x** - Navegação entre telas
- **AsyncStorage** - Persistência local
- **Axios 1.10.0** - Cliente HTTP com interceptadores

#### **Backend** (API REST)
- **Node.js** - Runtime do servidor
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação baseada em tokens

---

## 🚀 Como Iniciar o Projeto

### **Pré-requisitos**
```bash
# Node.js (versão 18+)
node --version

# npm ou yarn
npm --version

# Expo CLI
npm install -g @expo/cli
```

### **Instalação**
```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd FlashcardsApp

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Execute o projeto
npm start
```

### **Configuração do Ambiente (.env)**
```env
# API Configuration
API_BASE_URL=http://10.0.2.2:5000/api
API_TIMEOUT=10000

# App Configuration  
APP_NAME=FlashcardsApp
APP_VERSION=1.0.0

# Credenciais de teste
# Nome: João Silva
# Email: joao@teste.com
# Senha: 123456
```

### **Scripts Disponíveis**
```bash
npm start        # Inicia o Expo dev server
npm run android  # Executa no Android
npm run ios      # Executa no iOS  
npm run web      # Executa no navegador
```

---

## 🎯 Funcionalidades Detalhadas

### **1. Sistema de Autenticação**
- Login e registro de usuários
- Validação de formulários em tempo real
- Persistência de sessão com AsyncStorage
- Navegação condicional baseada no estado de autenticação

### **2. Organização Hierárquica**
```
📚 Matéria (ex: Matemática)
  └── 🎯 Tema (ex: Álgebra)
      └── 📝 Flashcard (Pergunta + Resposta)
```

### **3. Sistema de Repetição Espaçada**
- **Nunca estudado**: Disponível para primeiro estudo
- **Fácil**: Próxima revisão em 7 dias
- **Médio**: Próxima revisão em 3 dias  
- **Difícil**: Próxima revisão em 1 dia
- **Pronto para revisar**: Flashcards que atingiram a data de revisão

### **4. Interface de Estudo**
- Exibição de pergunta → Revelação da resposta
- Auto-avaliação (Acertei/Errei/Pular)
- Barra de progresso e estatísticas em tempo real
- Cálculo automático de performance

### **5. Dashboard Estatístico**
- Métricas gerais de estudo
- Gráficos de progresso diário
- Performance por matéria
- Identificação de temas para revisão

---

## 🔍 Componentes Principais

### **Componentes Reutilizáveis**
- **`Button`**: Botão com estados de loading e variantes
- **`Input`**: Campo de entrada com validação
- **`SearchInput`**: Busca com debounce e limpeza
- **`EmptyState`**: Estado vazio padronizado
- **`FABButton`**: Botão flutuante de ação

### **Hooks Personalizados**
- **`useEstudoData`**: Gerencia lógica de estudo e repetição espaçada
- **`useFlashcardsData`**: CRUD e busca de flashcards
- **`useHomeData`**: Dados da tela inicial e estatísticas
- **`useMateriaData`**: Gerenciamento de matérias
- **`useTemasData`**: Gerenciamento de temas

### **Gerenciamento de Estado**
- Estado local com `useState` e `useReducer`
- Persistência com `AsyncStorage`
- Atualização automática via `useFocusEffect`

---

## 📊 Algoritmo de Repetição Espaçada

### **Intervalos de Revisão**
```javascript
const DIFFICULTY_INTERVALS = {
  facil: 7,    // 7 dias
  medio: 3,    // 3 dias  
  dificil: 1   // 1 dia
}
```

### **Fluxo de Estudo**
1. **Apresentação da pergunta**
2. **Revelação da resposta pelo usuário**
3. **Auto-avaliação** (Fácil/Médio/Difícil)
4. **Cálculo da próxima revisão**
5. **Atualização das estatísticas**

### **Métricas Calculadas**
- **Taxa de acerto** por tema/matéria
- **Sequência de estudos** (dias consecutivos)
- **Temas pendentes de revisão**
- **Progresso diário**

---

## 🎨 Padrões de Design

### **Arquitetura de Componentes**
- **Componentes funcionais** com hooks
- **Memorização** com `React.memo` para performance
- **Separação de responsabilidades** (UI, lógica, dados)
- **Composição** over herança

### **Organização de Arquivos**
```
feature/
├── components/    # Componentes específicos da feature
├── page/         # Tela principal
└── hooks/        # Lógica de negócio (se necessário)
```

### **Padrões de Código**
- **TypeScript** para tipagem forte
- **Funções puras** sempre que possível
- **Constantes centralizadas** para textos e configurações
- **Validação** de formulários em tempo real

---

## 📱 Telas da Aplicação

### **LoginScreen**
- Formulário de login/registro
- Validação em tempo real
- Navegação automática após autenticação

### **HomeScreen**  
- Visão geral das estatísticas
- Acesso rápido às funcionalidades
- Cards de revisão com contadores

### **MateriasScreen**
- Listagem de matérias
- Busca e filtros
- CRUD completo

### **TemasScreen**
- Temas organizados por seções
- Indicadores de revisão
- Acesso direto ao estudo

### **FlashcardsScreen**
- Listagem de flashcards
- Busca por pergunta
- Preview das respostas

### **EstudoScreen**
- Interface de estudo otimizada
- Sistema de repetição espaçada
- Estatísticas em tempo real

### **DashboardScreen**
- Métricas detalhadas
- Gráficos de progresso
- Performance por matéria

---

## 🧪 Para Desenvolvedores

### **Como Contribuir para o Desenvolvimento**

1. **Estrutura de pastas**: Siga o padrão estabelecido
2. **Tipagem**: Use TypeScript em todos os arquivos
3. **Componentes**: Crie componentes reutilizáveis
4. **Hooks**: Extraia lógica complexa para hooks personalizados
5. **Constantes**: Centralize textos e configurações

### **Principais Arquivos para Modificação**

#### **Adicionar Nova Funcionalidade**
```typescript
// 1. Criar tipos em src/types/
interface NovaFeature {
  id: string;
  name: string;
}

// 2. Criar constantes em src/constants/
export const NOVA_FEATURE_CONFIG = {
  // configurações
};

// 3. Criar hook em src/utils/hooks/
export const useNovaFeature = () => {
  // lógica da feature
};

// 4. Criar componentes em src/components/
const NovaFeatureComponent = () => {
  // interface da feature
};
```

#### **Modificar API**
- Alterar `API_BASE_URL` no `.env`
- Modificar serviços em `src/services/` conforme necessidade:
  - `api.ts`: Configuração do cliente HTTP
  - `authService.ts`: Lógica de autenticação
  - `*Service.ts`: Endpoints específicos por feature
- Atualizar tipos em `src/types/`

#### **Adicionar Novo Endpoint**
```typescript
// 1. Adicionar função no service apropriado
export const newEndpoint = async (data: NewType): Promise<Response> => {
  const response = await api.post<Response>('/new-endpoint', data);
  return response.data;
};

// 2. Exportar no service
export const newService = {
  // ... outras funções
  newEndpoint,
};

// 3. Usar no hook customizado
const { data } = await newService.newEndpoint(payload);
```

#### **Personalizar Interface**
- Cores e estilos: Modificar `StyleSheet` em cada componente
- Textos: Alterar constantes em `src/constants/`
- Navegação: Modificar `App.tsx`

#### **Ajustar Algoritmo de Repetição**
- Intervalos: `src/constants/estudo.ts`
- Lógica: `src/utils/hooks/useEstudoData.tsx`

### **Arquivos Críticos do Sistema**
- **`App.tsx`**: Configuração principal e navegação
- **`src/types/`**: Definições de tipos TypeScript
- **`src/services/api.ts`**: Cliente HTTP com interceptadores
- **`src/services/*Service.ts`**: Camada de acesso aos dados
- **`src/utils/hooks/`**: Lógica de negócio dos hooks
- **`src/constants/`**: Configurações e textos da aplicação

---

## ⚡ Performance e Otimizações

### **Técnicas Utilizadas**
- **React.memo** para evitar re-renders desnecessários
- **useCallback** para memorização de funções
- **useMemo** para cálculos complexos
- **Debounce** na busca para evitar requisições excessivas
- **RefreshControl** para atualização manual

### **Gerenciamento de Memória**
- Limpeza de timers em `useEffect`
- Estados locais otimizados
- Carregamento sob demanda

---

## 🎓 Contexto Acadêmico (TCC)

### **Objetivos do Estudo**
- Implementar algoritmo de repetição espaçada
- Criar interface mobile otimizada para estudos
- Aplicar boas práticas de desenvolvimento React Native
- Demonstrar arquitetura escalável

### **Tecnologias Estudadas**
- **React Native** e **Expo** para desenvolvimento mobile
- **TypeScript** para tipagem e qualidade de código
- **Hooks** para gerenciamento de estado
- **AsyncStorage** para persistência local
- **Axios** para comunicação com API

### **Diferenciais Implementados**
- Arquitetura baseada em **hooks customizados**
- **Componentização** avançada
- Sistema de **repetição espaçada** personalizado
- Interface **responsiva** e **acessível**

---

## 🔧 Solução de Problemas

### **Problemas Comuns**

#### **Debug de API e Conectividade**
```bash
# Verificar se a API está rodando
curl http://localhost:5000/api/health

# Para Android Emulator, usar:
API_BASE_URL=http://10.0.2.2:5000/api

# Debug de token (no código)
import { debugCurrentToken } from './src/services/authService';
debugCurrentToken(); // Mostra logs detalhados do token
```

#### **Problemas de Autenticação**
```typescript
// Verificar token armazenado
import { getStoredToken } from './src/services/authService';
const token = await getStoredToken();
console.log('Token atual:', token);

// Limpar dados de auth
import { clearAuthData } from './src/services/authService';
await clearAuthData();
```

#### **Erro de Dependências**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Resetar Metro bundler
npx expo start --clear
```

#### **Problemas de Build**
```bash
# Verificar versão do Node.js
node --version # Deve ser 18+

# Verificar Expo CLI
npx expo --version
```

### **Logs e Debug**
- Use `console.log()` para debug durante desenvolvimento
- Ative **Remote JS Debugging** no menu do Expo
- Verifique **Network tab** para problemas de API

---

## 📚 Recursos Adicionais

### **Documentação**
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### **Extensões VS Code Recomendadas**
- ES7+ React/Redux/React-Native snippets
- TypeScript Hero
- Expo Tools
- Auto Rename Tag

---

## 👨‍💻 Autor

**Desenvolvedor do TCC**
- Sistema desenvolvido como Trabalho de Conclusão de Curso
- Foco em **algoritmos de repetição espaçada** e **desenvolvimento mobile**

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos (TCC).

---

## 🚀 Próximos Passos

Para continuar o desenvolvimento do TCC:

1. **Implementar Backend**: Criar API REST com Node.js/Express
2. **Adicionar Testes**: Implementar testes unitários e de integração
3. **Melhorar UX**: Adicionar animações e feedback visual
4. **Offline Support**: Implementar sincronização offline
5. **Analytics**: Adicionar métricas de uso e aprendizado
6. **Gamificação**: Sistema de pontos e conquistas

---

**📝 Nota**: Este README serve como documentação completa para que outro desenvolvedor ou chat possa entender rapidamente a estrutura do projeto e contribuir com o desenvolvimento do TCC.