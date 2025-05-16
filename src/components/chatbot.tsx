import React, { useState, useRef, FormEvent } from 'react';
import '../App.css';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    if (!question?.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    if (inputRef.current) inputRef.current.value = '';

    try {
      const res = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { type: 'bot', text: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setTimeout(() => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="chatbot-container">
      <div className="chatbot-header">
        <p className='chatbot-header-main'> MANASWI</p>
        <p className='chatbot-header-sub'>“The one with a mindful, balanced mind.”</p>
      </div>

      <div className="chatbot-conversation-container" ref={containerRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`speech speech-${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input-container">
        <input ref={inputRef} type="text" required placeholder="Ask something..." />
        <button type="submit" className="submit-btn">
          <img
            src="https://img.icons8.com/?size=100&id=93297&format=png&color=000000"
            alt="Send"
            className="send-btn-icon"
          />
        </button>
      </form>
      <div className='footer-copyrights'>
        By Sharath Upendran | @2025 ALL RIGHTS RESERVED
      </div>
    </section>
  );
};

export default Chatbot;
