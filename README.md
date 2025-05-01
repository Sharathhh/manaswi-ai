# mindfully-ai


🧠 Mental Health Chatbot
A full-stack conversational AI chatbot that provides answers to mental health FAQs using vector search and a local CSV dataset. Built with:

🧾 LangChain for retrieval-based question answering

🤗 Hugging Face embeddings (all-MiniLM-L6-v2)

🛢️ Supabase vector store 

💬 React + TypeScript frontend

📄 CSV knowledge base on mental health topics

🚀 Features
📚 Loads and embeds Q&A pairs from a Mental_Health_FAQ.csv file

🔎 Performs semantic search over answers

💡 Responds intelligently using LangChain LLM chain

🧑‍💻 Clean and modern chatbot UI (React + Tailwind/Custom CSS)

🌐 Ready for deployment as a full-stack app

🧩 Technologies
Tech	Purpose
React + TypeScript	Frontend UI
Node.js + Express	Backend API (/ask)
LangChain	LLM orchestration
Hugging Face	Text embeddings
Supabase	Vector DB for document search
csv-parser	Load questions/answers from CSV
