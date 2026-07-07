'use client';
import { useState } from 'react';

export default function MessageForm({ onMessageSent }: { onMessageSent: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        setContent('');
        onMessageSent();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <textarea 
        placeholder="Escribe algo aquí... Lo que sea. Al enviar se reiniciará el temporizador a 24 horas." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? 'Enviando...' : 'Enviar y Reiniciar Temporizador'}
      </button>
    </form>
  );
}
