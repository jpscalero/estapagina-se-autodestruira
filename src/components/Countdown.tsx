'use client';
import { useEffect, useState } from 'react';

export default function Countdown({ initialTimeRemaining, onExpire }: { initialTimeRemaining: number, onExpire: () => void }) {
  const [time, setTime] = useState(initialTimeRemaining);

  useEffect(() => {
    setTime(initialTimeRemaining);
  }, [initialTimeRemaining]);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onExpire]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const h = Math.floor(time / (1000 * 60 * 60));
  const m = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((time % (1000 * 60)) / 1000);

  return (
    <div className="countdown">
      {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
}
