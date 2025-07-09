import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Ollama } from '@langchain/community/llms/ollama';
import { retriever } from "./utils/retriever.js";
import { combineDocuments } from "./utils/combineDocuments.js";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const convHistory = [];

// ---------------------
// LLM: Ollama Instance
// ---------------------
const llm = new Ollama({
  model: 'qwen3:0.6b',
  temperature: 0.7,
  maxTokens: 200,
});

// ---------------------
// Intent Classifier
// ---------------------
const intentClassifierPrompt = (msg) => `
You are an intent classifier. Classify the following message into one of these categories:
- mental_health: questions about anxiety, depression, therapy, panic, feelings, etc.
- smalltalk: greetings like "hi", "hello", "how are you", "what's up", etc.
- non_mental_query: questions unrelated to mental health.

Examples:
"Hi there" → smalltalk  
"I'm feeling very anxious lately" → mental_health  
"What's the weather today?" → non_mental_query  
"I feel like crying" → mental_health  
"Hey!" → smalltalk  
"What's your name?" → smalltalk  
"Tell me about depression" → mental_health  
"How do I make pasta?" → non_mental_query  

Now classify this:

Message: "${msg}"
Intent:
`;

const detectIntent = async (msg) => {
   const result = await llm.invoke(intentClassifierPrompt(msg));
  console.log("🧠 Raw LLM result:", result);

  // Match one of the valid intents explicitly
  const intentMatch = result.match(/\b(mental_health|smalltalk|non_mental_query|emergency)\b/i);
  const intent = intentMatch ? intentMatch[1].toLowerCase() : "non_mental_query";

  console.log("✅ Final intent:", intent);
  return intent;
};

// ---------------------
// Prompt Templates
// ---------------------
const standaloneQuestionTemplate = `
Given some conversation history (if any) and a question, convert the question into a standalone question.

Conversation history: {conv_history}
Question: {question}
Standalone question:
`;

const answerTemplate = `
You are a helpful and enthusiastic support bot named Manaswi, who can answer a given question about mental health based on the context and conversation history. Try to find the answer in the context. If you really don't know the answer, use your own knowledge. Don't make up answers. Always speak like you're chatting with a friend.

Context: {context}
Conversation history: {conv_history}
Question: {question}
Answer:
`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

// ---------------------
// LangChain RAG Chain
// ---------------------
const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriever,
  combineDocuments
]);

const answerChain = answerPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    orginal_input: new RunnablePassthrough()
  },
  {
    context: retrieverChain,
    question: ({ orginal_input }) => orginal_input.question,
    conv_history: ({ orginal_input }) => orginal_input.conv_history
  },
  answerChain,
]);

// ---------------------
// Utility: Clean LLM Output
// ---------------------
function cleaned(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

// ---------------------
// POST /ask Route
// ---------------------
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const intent = await detectIntent(question);

    switch (intent) {
      case 'smalltalk':
        const casualReplies = [
          "Hey there! 😊 I am Manaswi AI,How can I support you today?",
          "Hi! I'm here to listen and help with anything on your mind.",
          "Hello! I am Manaswi Ai, How are you feeling today?",
          "Hey! I hope you're doing okay. Want to talk about something?"
        ];
        const reply = casualReplies[Math.floor(Math.random() * casualReplies.length)];
        convHistory.push(question, reply);
        return res.json({ response: reply });

      case 'mental_health':
        const response = await chain.invoke({
          question,
          conv_history: convHistory
        });
        const cleanResponse = cleaned(response);
        convHistory.push(question, cleanResponse);
        return res.json({ response: cleanResponse });

      case 'non_mental_query':
      default:
        return res.json({
          response: "I'm designed to help with mental health and emotional well-being. I can't assist with this query. If you have any mental health-related questions, feel free to ask! 💬"
        });
    }

  } catch (error) {
    console.error("❌ Error handling /ask:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ---------------------
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
