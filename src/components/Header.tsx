import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePulseChannel } from "@/hooks/usePulseChannel";
import { rtdb } from "@/integrations/firebase";
import { usePush } from "@/hooks/usePush";

const Header = () => {
  const [pairedCode, setPairedCode] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sendSound, setSendSound] = useState<boolean>(localStorage.getItem('sendSound') !== 'off');
  const [sendFlash, setSendFlash] = useState<boolean>(localStorage.getItem('sendFlash') !== 'off');
  const [recvSound, setRecvSound] = useState<boolean>(localStorage.getItem('recvSound') !== 'off');
  const [mood, setMood] = useState<string>(localStorage.getItem('mood') || 'calm');
  const [autoMood, setAutoMood] = useState<boolean>(localStorage.getItem('pulseAutoMood') !== 'off');
  const location = useLocation();
  const navigate = useNavigate();
  const [streakCount, setStreakCount] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const deferredPromptRef = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setPairedCode(localStorage.getItem("pairedWith"));
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  // Subscribe to streak for header chip
  useEffect(() => {
    if (!pairedCode) return;
    const ref = rtdb.ref(`/pairs/${pairedCode}/streak`);
    const handler = (snap: any) => {
      const val = snap.val();
      setStreakCount(val?.count || 0);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, [pairedCode]);

  // Apply mood background class on mount and when mood changes
  useEffect(() => {
    const root = document.body;
    root.classList.remove('mood-calm','mood-happy','mood-grateful');
    root.classList.add(`mood-${mood}`);
  }, [mood]);

  const applyMoodPulseDefaults = (m: string) => {
    if (!autoMood) return;
    try {
      const map: Record<string, { color: string; rhythmMs: number; intensity: 'soft'|'normal'|'strong' }> = {
        calm: { color: 'hsl(220, 80%, 45%)', rhythmMs: 2200, intensity: 'soft' },
        happy: { color: 'hsl(45, 85%, 50%)', rhythmMs: 1600, intensity: 'normal' },
        grateful: { color: 'hsl(330, 80%, 50%)', rhythmMs: 1400, intensity: 'strong' },
      };
      const curr = map[m] || map.calm;
      const existingRaw = localStorage.getItem('pulseDesign');
      let shape = 'heart';
      try { if (existingRaw) { const e = JSON.parse(existingRaw); if (e.shape) shape = e.shape; } } catch {}
      const payload = { shape, color: curr.color, rhythmMs: curr.rhythmMs, intensity: curr.intensity } as any;
      localStorage.setItem('pulseDesign', JSON.stringify(payload));
    } catch {}
  };

  const unpair = () => {
    if (!pairedCode) return;
    const ok = window.confirm("Unpair from this code? You can pair again anytime.");
    if (!ok) return;
    localStorage.removeItem("pairedWith");
    setPairedCode(null);
  };

  // Declare pulse channel and refs BEFORE effects that depend on lastPulse
  const { history, sendPulse, partnerOnline, partnerLastSeen, partnerActive, receiptsMap, partnerUid, lastPulse } = usePulseChannel(pairedCode);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const logoSyncRef = useRef<{ clear: () => void } | null>(null);
  const { supported, permission, token, enable, vapidConfigured } = usePush(pairedCode);

  // Synced bloom ring on logo when a pulse is received (runs after lastPulse is available)
  useEffect(() => {
    if (logoSyncRef.current) {
      try { logoSyncRef.current.clear(); } catch {}
      logoSyncRef.current = null;
    }
    if (!lastPulse) return;
    const el = logoRef.current as (HTMLElement | null);
    if (!el) return;
    const period = Math.max(600, lastPulse.payload?.rhythmMs || 1200);
    const originTs = lastPulse.ts || Date.now();
    const color = (lastPulse.payload && lastPulse.payload.color) || 'rgba(255,92,141,0.6)';
    let intervalId: any = null;
    let timeoutId: any = null;
    const trigger = () => {
      try {
        el.style.setProperty('--pulse-color', color as string);
        el.style.animation = 'none';
        void (el as any).offsetHeight;
        el.style.animation = `pulse-sync ${period}ms ease-in-out 1`;
      } catch {}
    };
    const now = Date.now();
    const elapsed = Math.max(0, now - originTs);
    const remainder = period - (elapsed % period);
    timeoutId = setTimeout(() => {
      trigger();
      intervalId = setInterval(trigger, period);
    }, remainder);
    const clear = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
    logoSyncRef.current = { clear };
    return clear;
  }, [lastPulse]);

  useEffect(() => {
    if (!lastPulse) return;
    if (!recvSound) return;
    const qh = localStorage.getItem('quietHours') === 'on';
    if (qh) {
      const h = new Date().getHours();
      if (h >= 22 || h < 7) return;
    }
    let lastSent = 0;
    try { lastSent = parseInt(localStorage.getItem('lastSentTs') || '0', 10) || 0; } catch {}
    if (Math.abs((lastPulse.ts || 0) - lastSent) < 500) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      g.connect(ctx.destination);
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(660, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.connect(g);
      o.start();
      o.stop(ctx.currentTime + 0.28);
      o.onended = () => ctx.close().catch(()=>{});
    } catch {}
  }, [lastPulse, recvSound]);

  const formatTimeAgo = (ts: number) => {
    const diff = Math.max(0, Date.now() - ts);
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/40 bg-background/40 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img ref={logoRef} src="/favicon.png" alt="PulsePod" className="w-6 h-6 rounded-md ring-1 ring-border/40" />
          <span className="font-semibold">PulsePod</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-2">
          <Link to="/custom-pulse">
            <Button variant="ghost" className="rounded-full">Customize</Button>
          </Link>
          <Link to="/history">
            <Button variant="ghost" className="rounded-full">History</Button>
          </Link>
          <Link to="/invite">
            <Button variant="ghost" className="rounded-full">Pair</Button>
          </Link>
          {canInstall && (
            <Button
              onClick={async () => { const p = deferredPromptRef.current; if (!p) return; setCanInstall(false); p.prompt(); try { await p.userChoice; } catch {} deferredPromptRef.current = null; }}
              className="rounded-full button-gradient text-white"
              size="sm"
            >
              Install
            </Button>
          )}
          <Sheet open={settingsOpen} onOpenChange={(o) => {
            setSettingsOpen(o);
            if (o) {
              try {
                setSendSound(localStorage.getItem('sendSound') !== 'off');
                setSendFlash(localStorage.getItem('sendFlash') !== 'off');
                setRecvSound(localStorage.getItem('recvSound') !== 'off');
              } catch {}
            }
          }}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="rounded-full">Settings</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-w-3xl mx-auto">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-6">
                <div className="flex justify-end -mt-2">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShowAdvanced(v => !v)}>
                    {showAdvanced ? 'Hide Advanced' : 'Advanced'}
                  </Button>
                </div>

                {showAdvanced && (
                <div>
                  <p className="font-medium mb-3">Mood</p>
                  <RadioGroup
                    value={mood}
                    onValueChange={(v) => {
                      setMood(v);
                      localStorage.setItem('mood', v);
                      applyMoodPulseDefaults(v);
                    }}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="calm" id="mood-calm" />
                      <Label htmlFor="mood-calm">Calm</Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="happy" id="mood-happy" />
                      <Label htmlFor="mood-happy">Happy</Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="grateful" id="mood-grateful" />
                      <Label htmlFor="mood-grateful">Grateful</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-sm font-medium">Auto adapt pulse to mood</p>
                      <p className="text-xs text-muted-foreground">Change default color/rhythm/intensity when mood changes</p>
                    </div>
                    <Switch
                      checked={autoMood}
                      onCheckedChange={(v) => { setAutoMood(v); localStorage.setItem('pulseAutoMood', v ? 'on' : 'off'); if (v) applyMoodPulseDefaults(mood); }}
                    />
                  </div>
                </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quiet Hours</p>
                    <p className="text-sm text-muted-foreground">Silence vibration between 22:00–07:00</p>
                  </div>
                  <Switch
                    defaultChecked={localStorage.getItem('quietHours') === 'on'}
                    onCheckedChange={(v) => localStorage.setItem('quietHours', v ? 'on' : 'off')}
                  />
                </div>
                {showAdvanced && (
                <div>
                  <p className="font-medium mb-3">Haptics Strength</p>
                  <RadioGroup
                    defaultValue={localStorage.getItem('haptics') || 'strong'}
                    onValueChange={(v) => localStorage.setItem('haptics', v)}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="off" id="hap-off" />
                      <Label htmlFor="hap-off">Off</Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="soft" id="hap-soft" />
                      <Label htmlFor="hap-soft">Soft</Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <RadioGroupItem value="strong" id="hap-strong" />
                      <Label htmlFor="hap-strong">Strong</Label>
                    </div>
                  </RadioGroup>
                </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      {supported ? (permission === 'granted' ? (token ? 'Enabled for this device.' : 'Granted — ready to enable.') : 'Permission not granted') : 'Not supported on this browser'}
                    </p>
                  </div>
                  <Button
                    disabled={!pairedCode || !supported || !vapidConfigured || permission === 'denied'}
                    onClick={async () => { await enable(); }}
                    className="rounded-full"
                  >
                    {permission === 'granted' && token ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sound on Send</p>
                    <p className="text-sm text-muted-foreground">Play a soft ping when you send a pulse</p>
                  </div>
                  <Switch
                    checked={sendSound}
                    onCheckedChange={(v) => { setSendSound(v); localStorage.setItem('sendSound', v ? 'on' : 'off'); }}
                  />
                </div>
                {showAdvanced && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Light Flash on Send</p>
                    <p className="text-sm text-muted-foreground">Brief glow when a pulse is sent</p>
                  </div>
                  <Switch
                    checked={sendFlash}
                    onCheckedChange={(v) => { setSendFlash(v); localStorage.setItem('sendFlash', v ? 'on' : 'off'); }}
                  />
                </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sound on Receive</p>
                    <p className="text-sm text-muted-foreground">Play a soft chime when you receive a pulse</p>
                  </div>
                  <Switch
                    checked={recvSound}
                    onCheckedChange={(v) => { setRecvSound(v); localStorage.setItem('recvSound', v ? 'on' : 'off'); }}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {pairedCode && (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 ring-1 ring-primary/20 text-foreground/90">Paired · {pairedCode}</span>
                  {streakCount > 0 && (
                    <span className="px-2 py-1 text-[11px] rounded-full bg-amber-100/60 ring-1 ring-amber-300/50 text-amber-900" title="Daily connection streak">🔥 Streak {streakCount}</span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 leading-none">
                  {partnerActive ? (
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active now</span>
                  ) : partnerLastSeen ? (
                    <>Last seen {formatTimeAgo(partnerLastSeen)}</>
                  ) : (
                    <>Last seen —</>
                  )}
                </span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full button-gradient">History</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-w-2xl mx-auto">
                  <SheetHeader>
                    <SheetTitle>Pulse History</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-3">
                    {history.length === 0 && (
                      <div className="text-sm text-muted-foreground">No pulses yet.</div>
                    )}
                    {history.slice().reverse().map((h, idx) => {
                      const seenTs = partnerUid ? (receiptsMap as any)?.[h.ts]?.[partnerUid] : undefined;
                      return (
                        <div key={h.ts + '-' + idx} className="flex items-center justify-between border rounded-md px-3 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: h.payload.color || 'hsl(var(--primary))' }} />
                            <div className="text-sm">
                              <div className="font-medium capitalize">{h.payload.shape || 'circle'}</div>
                              <div className="text-xs text-muted-foreground">{formatTimeAgo(h.ts)}</div>
                              {seenTs ? (
                                <div className="text-[11px] text-muted-foreground mt-0.5">Seen by partner {formatTimeAgo(seenTs)}</div>
                              ) : null}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => sendPulse(h.payload)}>Replay</Button>
                        </div>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={unpair}>Unpair</Button>
            </div>
          )}
        </nav>
        <div className="sm:hidden">
          <Button variant="outline" className="rounded-full" onClick={() => navigate("/invite")}>Pair</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
