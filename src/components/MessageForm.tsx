'use client';
import { useState, useEffect } from 'react';

export default function MessageForm({ onMessageSent }: { onMessageSent: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Anti-bot
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [mathAnswer, setMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const generateMath = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setMathAnswer('');
  };

  useEffect(() => {
    generateMath();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !mathAnswer.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          mathAnswer,
          num1,
          num2,
          honeypot
        })
      });
      if (res.ok) {
        setContent('');
        generateMath();
        onMessageSent();
      } else {
        const errorData = await res.json();
        alert('Error: ' + errorData.error);
        generateMath(); // Reset captcha on error
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea 
        placeholder="Escribe algo aquí... Lo que sea. Al enviar se reiniciará el temporizador a 24 horas." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        required
      />
      
      {/* Honeypot field (hidden from users) */}
      <input 
        type="text" 
        style={{ display: 'none' }} 
        tabIndex={-1} 
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        placeholder="Do not fill this out"
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span>Protección Anti-Bot: ¿Cuánto es <strong>{num1} + {num2}</strong>?</span>
        <input 
          type="number" 
          value={mathAnswer} 
          onChange={(e) => setMathAnswer(e.target.value)} 
          required 
          disabled={loading}
          style={{ width: '80px', padding: '0.5rem', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid #333' }}
        />
      </div>

      <button type="submit" disabled={loading || !content.trim() || !mathAnswer.trim()}>
        {loading ? 'Enviando...' : 'Enviar y Reiniciar Temporizador'}
      </button>
    </form>
  );
}
