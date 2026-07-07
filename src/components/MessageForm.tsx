'use client';
import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function MessageForm({ onMessageSent }: { onMessageSent: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  
  // Dummy key for local testing. Replace in Vercel with real site key.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !turnstileToken) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, turnstileToken })
      });
      if (res.ok) {
        setContent('');
        // We do NOT reset the turnstile token immediately so they don't have to solve it twice in a row,
        // but Turnstile tokens expire. For simplicity, we keep it until reload or we can reset it.
        onMessageSent();
      } else {
        const errorData = await res.json();
        alert('Error: ' + errorData.error);
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
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Turnstile 
          siteKey={siteKey} 
          onSuccess={(token) => setTurnstileToken(token)} 
        />
      </div>

      <button type="submit" disabled={loading || !content.trim() || !turnstileToken}>
        {loading ? 'Enviando...' : 'Enviar y Reiniciar Temporizador'}
      </button>
    </form>
  );
}
