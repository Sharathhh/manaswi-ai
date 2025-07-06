import fs from 'fs';
import csv from 'csv-parser';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl= 'https://eheyqrprdbkintuxwbsl.supabase.co'

const supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZXlxcnByZGJraW50dXh3YnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTA4MzMsImV4cCI6MjA2MTA4NjgzM30.RZ8l5ALGz0S_sKKhAQ1LRfPC3GqDMoHL3H55oE-9KFg'

const result = [];

// Step 1: Load CSV file
fs.createReadStream('Mental_Health_FAQ.csv')
  .pipe(csv())
  .on('data', (row) => {


    if (row.Questions && row.Answers){


        const content= `Question: ${row.Questions} \n Answer: ${row.Answers}`


        result.push( new Document({

            pageContent: content,
            metadata: {
                id: row.Question_ID
            }

        }))
    }
  })
  .on('end', async()=>{
    console.log(`${result.length} pairs of question and answers`)


    console.log(result)


    const splitter= new RecursiveCharacterTextSplitter({
        chunkSize: 384,
        separators: ['\n\n', '\n', '.', '?', '!', '。', '？', '！', ' '],
        chunkOverlap: 50,
    })


    const splitDocs= await splitter.splitDocuments(result)

    console.log(`Split into ${splitDocs.length} chunks`)



    
    const client= createClient(supabaseUrl, supabaseKey)



    const embedding=  new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACEHUB_API_KEY,
        model: 'DMetaSoul/Dmeta-embedding-zh'
    })



    const vectorStore= new SupabaseVectorStore(embedding,{
        client: client,
        tableName: 'documents',
        queryName: 'match_documents',
    })
    



  })