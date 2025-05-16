import fs from 'fs';
import csv from 'csv-parser';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl= process.env.SUPABASE_URL

const supabaseKey= process.env.SUPABASE_KEY

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




    const splitter= new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators: ['\n\n', '\n', ' ',],
        chunkOverlap: 50,
    })


    const splitDocs= await splitter.splitDocuments(result)

    
    const client= createClient(supabaseUrl, supabaseKey)



    const embedding=  new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACEHUB_API_KEY,
        model: 'sentence-transformers/all-MiniLM-L6-v2'
    })



    const vectorStore= new SupabaseVectorStore(embedding,{
        client: client,
        tableName: 'documents',
        queryName: 'doc_match',
    })
    







  })