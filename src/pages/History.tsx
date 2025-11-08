import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { usePulseChannel, PulseEvent } from "@/hooks/usePulseChannel";
import { rtdb } from "@/integrations/firebase";

const formatDateTime = (ts: number) => {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "" + ts;
  }
};

const History = () => {
  const [pairedCode, setPairedCode] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(20);
  const [items, setItems] = useState<PulseEvent[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  useEffect(() => { setPairedCode(localStorage.getItem("pairedWith")); }, []);
  const { sendPulse } = usePulseChannel(pairedCode);

  useEffect(() => {
    if (!pairedCode) { setItems([]); setHasMore(false); return; }
    const ref = rtdb.ref(`/pairs/${pairedCode}/history`).limitToLast(limit);
    const handler = (snap: any) => {
      const val = snap.val() || {};
      const keys = Object.keys(val);
      const list: PulseEvent[] = keys.map((k) => ({
        type: 'pulse' as const,
        pairId: pairedCode,
        ts: val[k].ts,
        payload: { color: val[k].color, shape: val[k].shape, rhythmMs: val[k].rhythmMs, intensity: val[k].intensity }
      })).sort((a,b) => a.ts - b.ts);
      setItems(list);
      setHasMore(keys.length >= limit);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, [pairedCode, limit]);

  const rhythmLabel = (ms?: number) => {
    if (!ms) return '—';
    if (ms <= 1200) return 'Fast';
    if (ms <= 2200) return 'Balanced';
    return 'Calm';
  };

  const intensityClass = (i?: string) => {
    if (i === 'soft') return 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/20';
    if (i === 'strong') return 'bg-pink-500/15 text-pink-400 ring-1 ring-pink-400/20';
    return 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-400/20';
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pulse Timeline</h1>
          <Link to="/"><Button variant="ghost" className="rounded-full">Back</Button></Link>
        </div>
        {!pairedCode && (
          <div className="text-sm text-muted-foreground mb-6">Pair with someone to see shared pulse history.</div>
        )}
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No pulses yet.</div>
        ) : (
          <ol className="relative border-l border-border/40 pl-4 space-y-4">
            {items.slice().reverse().map((h, idx) => {
              const color = h.payload.color || 'hsl(var(--primary))';
              const shape = (h.payload.shape || 'circle') as string;
              return (
                <li key={h.ts + '-' + idx} className="ml-2">
                  <span className="absolute -left-[7px] mt-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-background" style={{ background: color }} />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium capitalize flex items-center gap-2">
                        <span>{shape}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] ${intensityClass(h.payload.intensity)}`}>{(h.payload.intensity || 'normal')}</span>
                        <span className="text-[11px] text-muted-foreground">{rhythmLabel(h.payload.rhythmMs)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(h.ts)}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendPulse(h.payload)}>Replay</Button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {hasMore && (
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => setLimit((n) => n + 20)} className="rounded-full">Load more</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
