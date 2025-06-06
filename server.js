import dotenv from "dotenv";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PromptTemplate } from "@langchain/core/prompts";

import {createClient} from '@supabase/supabase-js';

import {HuggingFaceInferenceEmbeddings} from '@langchain/community/embeddings/hf'

import {StringOutputParser} from '@langchain/core/output_parsers' 

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';


import { formatConvHistory } from "./utils/fromatConvHistory.js";


import express from 'express';

import cors from 'cors'

import { retriever } from "./utils/retriever.js";
import { combineDocuments } from "./utils/combineDocuments.js";
import { Runnable, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;


const app= express()
app.use(cors())
app.use(express.json())




app.post('/ask', async (req, res)=>{
    const question = req.body.question
    try{
        const response= await chain.invoke({question: question, conv_history: convHistory})

        convHistory.push(question)
        convHistory.push(response)

        res.json({response})
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Something went wrong'})
    }
})

  const port =3000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})





const llm = new HuggingFaceInference({
  model: "HuggingFaceH4/zephyr-7b-beta",
  apiKey: HF_TOKEN,
  temperature: 0.5,
  maxTokens: 100
});

const standaloneQuestionTemplate= 'Given some conversation history (if any) and a question, convert the question into a standalone question. conversation history: {conv_history} question: {question} standalone question:'


const standaloneQuestionprompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);


const answerTemplate= `You are helpful and enthusiastic support bot named Manaswi, who can answer a given question about mental health based on the context
 on the context provided and conversation history. Try to find the answer in the context . If you really don't know the answer, say "I am sorry, I don't know the
answer to that." And direct the questioner to email help@manaswi.com . Don't try to make up an answer. Always speak as if you were chatting with a friend.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `


const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)



const standaloneQuestionChain = standaloneQuestionprompt.pipe(llm).pipe(new StringOutputParser())



const retrieverChain= RunnableSequence.from([
  prevResult=> prevResult.standalone_question,
  retriever,
  combineDocuments
])

const answerChain= answerPrompt.pipe(llm).pipe(new StringOutputParser())



const chain = RunnableSequence.from([
  
  {
    standalone_question: standaloneQuestionChain,
    orginal_input: new RunnablePassthrough()

  },
  {
    context: retrieverChain,
    question: ({orginal_input})=> orginal_input.question,

    conv_history: ({orginal_input})=> orginal_input.conv_history
  },
  answerChain,


])

const convHistory=[]




    





