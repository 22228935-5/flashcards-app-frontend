# 📱 Flashcards App - Frontend

> Aplicativo móvel de flashcards com repetição espaçada desenvolvido em React Native + Expo

[![React Native](https://img.shields.io/badge/React%20Native-0.74+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)

## 📖 Sobre o Projeto

Aplicativo móvel desenvolvido como **TCC** que implementa sistema de estudos com **flashcards** e **repetição espaçada**. Interface otimizada para facilitar o aprendizado através de revisões programadas baseadas na dificuldade percebida pelo usuário.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação** com login/registro
- 📚 **Organização hierárquica** (Matérias → Temas → Flashcards)
- 🧠 **Repetição espaçada** com intervalos adaptativos
- 📊 **Dashboard estatístico** com métricas de performance
- 🔍 **Sistema de busca** em tempo real
- 📱 **Interface responsiva** e intuitiva

## 🛠️ Tecnologias

- **React Native 0.74+** - Framework mobile
- **Expo 51+** - Plataforma de desenvolvimento
- **TypeScript 5.8+** - Tipagem estática
- **React Navigation 6+** - Navegação entre telas
- **Axios** - Cliente HTTP
- **AsyncStorage** - Persistência local

## 🚀 Quick Start

### 📋 Pré-requisitos
- Node.js 18+
- Expo CLI
- Android Studio (para emulador) ou dispositivo físico

### ⚡ Instalação
```bash
# 1. Clone o repositório
git clone <repo-url>
cd flashcards-app-frontend

# 2. Instale dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com URL da API

# 4. Execute o projeto
npm start
```

### 🔧 Configuração (.env)
```env
API_BASE_URL=http://10.0.2.2:5000/api
API_TIMEOUT=10000
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── screens/            # Telas da aplicação
│   ├── login/          # Autenticação
│   ├── home/           # Dashboard principal
│   ├── materias/       # Gerenciamento de matérias
│   ├── temas/          # Gerenciamento de temas
│   ├── flashcards/     # CRUD de flashcards
│   └── estudo/         # Interface de estudo
├── services/           # Comunicação com API
├── hooks/              # Hooks customizados
├── types/              # Definições TypeScript
└── constants/          # Configurações
```

## 📱 Principais Telas

### **🔐 Login**
- Autenticação com validação em tempo real
- Registro de novos usuários
- Persistência de sessão

### **🏠 Home (Dashboard)**
- Estatísticas gerais de estudo
- Cards de revisão com contadores
- Acesso rápido às funcionalidades

### **📚 Matérias**
- Listagem e busca de matérias
- CRUD completo
- Navegação para temas

### **🎯 Temas**
- Organização por status de revisão
- Indicadores visuais de progresso
- Acesso direto ao estudo

### **📝 Flashcards**
- Gerenciamento de cartões
- Preview de perguntas/respostas
- Sistema de busca

### **🧠 Estudo**
- Interface de repetição espaçada
- Auto-avaliação (Fácil/Médio/Difícil)
- Estatísticas em tempo real

## 📊 Sistema de Repetição Espaçada

Algoritmo que calcula próxima revisão baseado na dificuldade:

- **Fácil**: 7 dias para próxima revisão
- **Médio**: 3 dias para próxima revisão  
- **Difícil**: 1 dia para próxima revisão

## 🧪 Scripts Disponíveis

```bash
npm start        # Inicia servidor Expo
npm run android  # Executa no Android
npm run ios      # Executa no iOS
npm run web      # Executa no navegador
```

## 🔧 Solução de Problemas

### **API não conecta:**
```bash
# Verificar se backend está rodando
curl http://localhost:5000/api

# Android Emulator usar:
API_BASE_URL=http://10.0.2.2:5000/api
```

### **Problemas de dependências:**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

---

**Sistema desenvolvido como TCC aplicando boas práticas de desenvolvimento mobile e UX otimizada para estudos.**