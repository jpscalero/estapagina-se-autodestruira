'use client';

import { useState, useEffect, useCallback } from 'react';
import Countdown from '@/components/Countdown';
import MessageForm from '@/components/MessageForm';
import MessageList from '@/components/MessageList';

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [destructed, setDestructed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      setTimeRemaining(data.timeRemaining);
      setDestructed(data.destructed);
      if (data.destructed) {
        setReloadKey(k => k + 1); // reload messages if destructed
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleMessageSent = () => {
    setReloadKey(k => k + 1);
    fetchState();
  };

  const handleExpire = () => {
    setDestructed(true);
    fetchState(); // Re-fetch to confirm and reset
  };

  if (timeRemaining === null) {
    return <main style={{ textAlign: 'center', marginTop: '5rem' }}><h1>Cargando...</h1></main>;
  }

  return (
    <main>
      <h1>Esta Página Se Autodestruirá</h1>
      
      <div className="status-bar" style={{ borderColor: destructed ? '#ff4444' : 'var(--foreground)', color: destructed ? '#ff4444' : 'inherit' }}>
        ESTADO: {destructed ? 'DESTRUIDA Y REINICIADA' : 'VIVA'}
      </div>

      <p style={{textAlign: 'center', opacity: 0.8}}>
        Si el temporizador llega a cero, todos los mensajes serán borrados y la página se considerará destruida.
      </p>

      <Countdown initialTimeRemaining={timeRemaining} onExpire={handleExpire} />
      
      <MessageForm onMessageSent={handleMessageSent} />
      
      <MessageList triggerReload={reloadKey} />
      
    </main>
  );
}
