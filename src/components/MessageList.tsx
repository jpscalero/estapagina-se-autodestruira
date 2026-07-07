'use client';
import { useEffect, useState } from 'react';

type Message = {
  id: number;
  content: string;
  created_at: string;
}

export default function MessageList({ triggerReload }: { triggerReload: number }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(console.error);
  }, [triggerReload]);

  return (
    <div className="card">
      <h2>Últimos Mensajes</h2>
      <div className="message-grid">
        {messages.length === 0 ? (
          <p>No hay mensajes aún.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="message-item">
              <div className="message-date">{new Date(msg.created_at + 'Z').toLocaleString()}</div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
