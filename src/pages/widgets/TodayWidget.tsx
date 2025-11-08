import { useEffect, useState } from "react";
import { rtdb } from "@/integrations/firebase";

const formatYMD = (d: Date) => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;

const TodayWidget = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const ymd = formatYMD(new Date());
    const ref = rtdb.ref(`/stats/daily/${ymd}`);
    const handler = (snap: any) => {
      const v = snap.val();
      setCount(typeof v === 'number' ? v : 0);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, []);

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      color: '#0f172a',
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 999,
      border: '1px solid rgba(148,163,184,0.35)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
    }}>
      <span role="img" aria-label="heart" style={{fontSize: 16}}>💓</span>
      <span style={{fontSize: 13, color: '#475569'}}>Sent today</span>
      <strong style={{fontSize: 14}}>{count === null ? '—' : count.toLocaleString()}</strong>
    </div>
  );
};

export default TodayWidget;
