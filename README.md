<<<<<<< HEAD

# 🧠 Manasvi AI — “the one with a mindful, balanced mind.”

Manasvi (मनस्वि) is a Sanskrit word that means one with a strong, thoughtful, and balanced mind.
Manasvi AI is an intelligent mental health chatbot built to support, inform, and gently guide users through questions around emotional well-being, mental clarity, and inner peace.
 An AI-powered mental health assistant built with LangChain, Supabase, and Hugging Face — here to support your mental health.

---

## 💡 Overview

**MANASWI AI** is a full-stack chatbot designed to answer mental health–related questions using a locally embedded dataset. It combines the power of large language models (LLMs), vector search, and a custom mental health FAQ to provide meaningful, empathetic, and informative responses: 

🧾 LangChain for retrieval-based question answering

🤗 Hugging Face embeddings (all-MiniLM-L6-v2)

🛢️ Supabase vector store 

💬 React + TypeScript frontend

📄 CSV knowledge base on mental health topics

---

## 🚀 Features
📚 Loads and embeds Q&A pairs from a Mental_Health_FAQ.csv file.

🔎 Performs semantic search over answers.

💡 Responds intelligently using LangChain LLM chain.

🧑‍💻 Clean and modern chatbot UI (React + Tailwind/Custom CSS).

🌐 Ready for deployment as a full-stack app.

---

## 🧩 Technologies

Tech	Purpose
React + TypeScript	Frontend UI
Node.js + Express	Backend API (/ask)
LangChain	LLM orchestration
Hugging Face	Text embeddings
Supabase	Vector DB for document search
csv-parser	Load questions/answers from CSV
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
>>>>>>> f07b153 (final commit)
