import { useEffect, useMemo, useRef, useState } from "react";
import { rtdb } from "@/integrations/firebase";
import { Button } from "@/components/ui/button";

type Bucket = { count: number; lastTs?: number };

const formatYMD = (d: Date) => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;

const MapPage = () => {
  const [dayYMD, setDayYMD] = useState<string>(() => formatYMD(new Date()));
  const [buckets, setBuckets] = useState<Record<string, Bucket>>({});
  const [loading, setLoading] = useState(true);
  const [totalPulses, setTotalPulses] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    const ref = rtdb.ref(`/globalHeat/${dayYMD}`);
    const handler = (snap: any) => {
      setBuckets(snap.val() || {});
      setLoading(false);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, [dayYMD]);

  // Subscribe to global public counter
  useEffect(() => {
    const ref = rtdb.ref('/stats/totalPulses');
    const handler = (snap: any) => {
      const v = snap.val();
      if (typeof v === 'number') setTotalPulses(v);
      else setTotalPulses(null);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, []);

  const points = useMemo(() => {
    const list: { lat: number; lon: number; count: number }[] = [];
    for (const key of Object.keys(buckets)) {
      const b = buckets[key];
      if (!b || typeof b.count !== 'number') continue;
      const [latStr, lonStr] = key.split(',');
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);
      if (Number.isFinite(lat) && Number.isFinite(lon)) list.push({ lat, lon, count: b.count });
    }
    return list;
  }, [buckets]);

  // Render heat onto canvas (equirectangular projection)
  useEffect(() => {
    const canvas = canvasRef.current; const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { clientWidth: w, clientHeight: h } = container;
    canvas.width = Math.max(640, w) * dpr;
    canvas.height = Math.max(360, Math.round(w * 0.5)) * dpr;
    canvas.style.width = `${Math.max(640, w)}px`;
    canvas.style.height = `${Math.max(360, Math.round(w * 0.5))}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    const project = (lat:number, lon:number) => {
      const x = ((lon + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      return { x, y };
    };

    // draw soft background grid dots based on counts
    const max = points.reduce((m,p)=> Math.max(m, p.count), 1);
    for (const p of points) {
      const { x, y } = project(p.lat, p.lon);
      const radius = 16 + (p.count / max) * 28;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius * dpr);
      const hue = 200 - Math.min(160, (p.count / max) * 160); // cyan->pink
      g.addColorStop(0, `hsla(${hue}, 90%, 60%, 0.35)`);
      g.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius * dpr, 0, Math.PI*2);
      ctx.fill();
    }

    // soft overlay for subtle border
    ctx.globalCompositeOperation = 'source-over';
  }, [points]);

  const changeDay = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    setDayYMD(formatYMD(d));
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Global Pulse Map</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => changeDay(-1)} className="rounded-full">Prev day</Button>
            <Button variant="ghost" onClick={() => setDayYMD(formatYMD(new Date()))} className="rounded-full">Today</Button>
            <Button variant="ghost" onClick={() => changeDay(1)} className="rounded-full">Next day</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm text-muted-foreground">Anonymous heatmap of pulse activity. Locations are quantized to ~50–60 km.</p>
          <div className="text-sm rounded-full border border-border/50 px-3 py-1 bg-background/60">
            {typeof totalPulses === 'number' ? (
              <>Total Pulses Sent: <span className="font-medium">{totalPulses.toLocaleString()}</span></>
            ) : (
              <>Total Pulses Sent: —</>
            )}
          </div>
        </div>
        <div ref={containerRef} className="w-full rounded-xl border border-border/40 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.025),transparent_60%)]">
          <canvas ref={canvasRef} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">{loading ? 'Loading…' : `${points.length} active regions`}</div>
      </div>
    </div>
  );
};

export default MapPage;
