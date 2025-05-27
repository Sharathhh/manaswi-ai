import express from "express";
import { spawn } from "child_process";
import { json } from "stream/consumers";

import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const prompt = req.body.prompt;
  const ollama = spawn("ollama", ["run", "qwen3:0.6b"]);

  let output = "";

  ollama.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollama.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Ollama exited with error." });
    }

    const thinkTag = "</think>";
    let cleaned = output.trim();
    if (cleaned.includes(thinkTag)) {
      cleaned = cleaned.split(thinkTag)[1].trim("\n");
      cleaned = cleaned.replaceAll("\n\n", "\n");
      cleaned = cleaned.replaceAll("\n", "").trim();
      cleaned = cleaned.trim();
      cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").trim();
    }

    res.json({ reply: cleaned });
  });

  // Send the prompt to the model
  ollama.stdin.write(prompt + "\n");
  ollama.stdin.end();
});

const runTest = async () => {
  const response = await fetch("http://localhost:4000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "about india" }),
  });
  const data = await response.json();

  console.log(data);
};

runTest();

app.listen(4000, () => console.log("API server listening on port 4000"));
