import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePulseChannel } from "@/hooks/usePulseChannel";
import { rtdb } from "@/integrations/firebase";
import { Heart, Sparkles, Circle as CircleIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// Hero image placeholder used if assets are not available

const Hero = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    (window as any).plausible?.('Hero CTA Click');
  };

  const [pairedCode, setPairedCode] = useState<string | null>(null);
  useEffect(() => {
    setPairedCode(localStorage.getItem('pairedWith'));
  }, []);
  const unpair = () => {
    localStorage.removeItem('pairedWith');
    setPairedCode(null);
    (window as any).plausible?.('Unpair Click');
  };

  const { sendPulse, lastPulse } = usePulseChannel(pairedCode);
  const vibratePattern = useMemo(() => [60, 80, 60], []);
  const syncBeatRef = useRef<{ clear: () => void } | null>(null);
  const [rxDesign, setRxDesign] = useState<{ color?: string; shape?: string; rhythmMs?: number } | null>(null);
  const sendBlockRef = useRef<number | null>(null);
  const [reactArmedUntil, setReactArmedUntil] = useState<number | null>(null);
  const [showReactHint, setShowReactHint] = useState(false);

  // A2HS install prompt handling
  const deferredPromptRef = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);
  const triggerInstall = async () => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) return;
    setCanInstall(false);
    promptEvent.prompt();
    try { await promptEvent.userChoice; } catch {}
    deferredPromptRef.current = null;
  };

  // Streak subscription (after pairedCode is set)
  const [streak, setStreak] = useState<number>(0);
  useEffect(() => {
    if (!pairedCode) return;
    const ref = rtdb.ref(`/pairs/${pairedCode}/streak`);
    const handler = (snap: any) => {
      const val = snap.val();
      setStreak(val?.count || 0);
    };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, [pairedCode]);
  useEffect(() => {
    if (!lastPulse) return;
    // Haptics + Quiet Hours
    const haptics = localStorage.getItem('haptics') || 'strong'; // 'off' | 'soft' | 'strong'
    const quiet = localStorage.getItem('quietHours') === 'on';
    const now = new Date();
    const hour = now.getHours();
    const inQuiet = quiet && (hour >= 22 || hour < 7);
    if (!inQuiet && haptics !== 'off' && navigator.vibrate) {
      try {
        const pattern = haptics === 'soft' ? [30, 40, 30] : [60, 80, 60];
        navigator.vibrate(pattern);
      } catch {}
    }
    const el = document.getElementById('hero-glow');
    if (el) {
      const color = (lastPulse.payload && lastPulse.payload.color) || 'rgba(255,92,141,0.6)';
    const intensity = (lastPulse.payload as any)?.intensity as ('soft'|'normal'|'strong'|undefined);
    const blur = intensity === 'soft' ? '24px' : intensity === 'strong' ? '64px' : '40px';
    const ring = intensity === 'soft' ? '8px' : intensity === 'strong' ? '16px' : '12px';
      el.classList.add('ring-4');
      const prevBox = (el as HTMLElement).style.boxShadow;
      (el as HTMLElement).style.boxShadow = `0 0 0 4px ${color}`;
      setTimeout(() => {
        el.classList.remove('ring-4');
        (el as HTMLElement).style.boxShadow = prevBox;
      }, 400);
    }
    setRxDesign(lastPulse.payload || null);
    // Arm quick reaction for a short window if this wasn't our own send
    try {
      const lastSentStr = localStorage.getItem('lastSentTs');
      const lastSent = lastSentStr ? parseInt(lastSentStr, 10) : 0;
      const isSelf = lastSent && Math.abs((lastPulse.ts || 0) - lastSent) < 900;
      if (!isSelf) {
        const until = Date.now() + 7000; // 7s window to react
        setReactArmedUntil(until);
        setShowReactHint(true);
        setTimeout(() => setShowReactHint(false), 2500);
      }
    } catch {}
  }, [lastPulse, vibratePattern]);

  // Real-time pulse animation synced to sender's timestamp and rhythm
  useEffect(() => {
    // Clear any previous scheduler
    if (syncBeatRef.current) {
      try { syncBeatRef.current.clear(); } catch {}
      syncBeatRef.current = null;
    }
    if (!lastPulse) return;

    const el = document.getElementById('hero-glow') as HTMLElement | null;
    if (!el) return;

    const period = Math.max(600, lastPulse.payload?.rhythmMs || 1200);
    const originTs = lastPulse.ts || Date.now();
    const color = (lastPulse.payload && lastPulse.payload.color) || 'rgba(255,92,141,0.6)';
    const intensityRx = (lastPulse.payload as any)?.intensity as ('soft'|'normal'|'strong'|undefined);
    const blurVal = intensityRx === 'soft' ? '24px' : intensityRx === 'strong' ? '64px' : '40px';
    const ringVal = intensityRx === 'soft' ? '8px' : intensityRx === 'strong' ? '16px' : '12px';

    let intervalId: any = null;
    let timeoutId: any = null;

    const trigger = () => {
      try {
        el.style.setProperty('--pulse-color', color as string);
        el.style.setProperty('--pulse-blur', blurVal);
        el.style.setProperty('--pulse-ring', ringVal);
        // restart animation
        el.style.animation = 'none';
        // force reflow
        void (el as any).offsetHeight;
        el.style.animation = `pulse-sync ${period}ms ease-in-out 1`;
      } catch {}
    };

    // Align first trigger to sender phase
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
    syncBeatRef.current = { clear };

    return clear;
  }, [lastPulse]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark px-4 py-16 md:py-0">
      {/* Animated gradient wave background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 bg-[length:200%_200%] animate-gradient-wave" />
      {/* Low-opacity heartbeat gradient background */}
      <div className="absolute inset-0 hero-pulse animate-heartbeat-slow opacity-40" />
      
      {/* Animated background orbs with heartbeat */}
      <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/20 rounded-full blur-3xl animate-heartbeat" />
      <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-secondary/20 rounded-full blur-3xl animate-heartbeat" style={{ animationDelay: '1.25s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[32rem] h-96 md:h-[32rem] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center animate-fade-in px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
          Send a heartbeat,<br />not a message.
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          One tap. One glow. One moment of presence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={scrollToWaitlist}
            size="lg"
            className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-cta text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1 rounded-full"
          >
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </Button>
          
          <Link to="/custom-pulse" onClick={() => (window as any).plausible?.('Customize CTA Click')}>
            <Button 
              size="lg"
              variant="default"
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-105 rounded-full"
            >
              Customize Your Pulse ✨
            </Button>
          </Link>

          <Link to="/invite" onClick={() => (window as any).plausible?.('Pair CTA Click')}>
            <Button 
              size="lg"
              variant="default"
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-105 rounded-full"
            >
              Pair 🔗
            </Button>
          </Link>

          {/* Install button moved to Header for better placement */}

          {pairedCode && (
            <Button 
              size="lg"
              onClick={() => {
                // Debounce send to 800ms
                const now = Date.now();
                if (sendBlockRef.current && now - sendBlockRef.current < 800) return;
                sendBlockRef.current = now;
                let payload: any = {};
                try {
                  const raw = localStorage.getItem('pulseDesign');
                  if (raw) payload = JSON.parse(raw);
                } catch {}
                sendPulse(payload);
                // Instant feedback on send
                try {
                  // Light flash
                  if (localStorage.getItem('sendFlash') !== 'off') {
                    const el = document.getElementById('hero-glow');
                    if (el) {
                      const color = (payload && payload.color) || 'rgba(255,92,141,0.6)';
                      el.classList.add('ring-4');
                      const prevBox = (el as HTMLElement).style.boxShadow;
                      (el as HTMLElement).style.boxShadow = `0 0 0 4px ${color}`;
                      setTimeout(() => {
                        el.classList.remove('ring-4');
                        (el as HTMLElement).style.boxShadow = prevBox;
                      }, 300);
                    }
                  }
                  // Sound ping
                  if (localStorage.getItem('sendSound') !== 'off' && 'AudioContext' in window) {
                    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
                    const ctx = new Ctx();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = 880; // A5 ping
                    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
                    osc.connect(gain).connect(ctx.destination);
                    osc.start();
                    setTimeout(() => { try { osc.stop(); ctx.close(); } catch {} }, 160);
                  }
                } catch {}
              }}
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-primary text-white hover:opacity-90 transition-all duration-300 hover:scale-105 rounded-full"
            >
              Send Pulse 💗
            </Button>
          )}

          
        </div>

        {/* Received pulse preview (reflect shape/color/speed) */}
        {rxDesign && (
          <div className="mt-3 flex items-center justify-center">
            {(() => {
              const color = rxDesign.color || 'rgba(255,92,141,0.8)';
              const anim = `heartbeat ${Math.max(600, rxDesign.rhythmMs || 1200)}ms ease-in-out 2`;
              const glow = `0 0 18px ${color}`;
              if (rxDesign.shape === 'heart') {
                return (
                  <Heart
                    aria-label="Received heart pulse"
                    className="w-8 h-8"
                    style={{ color, filter: 'drop-shadow(0 0 18px rgba(0,0,0,0))', animation: anim }}
                  />
                );
              }
              if (rxDesign.shape === 'sparkle') {
                return (
                  <Sparkles
                    aria-label="Received sparkle pulse"
                    className="w-8 h-8"
                    style={{ color, filter: 'drop-shadow(0 0 16px rgba(0,0,0,0))', animation: anim }}
                  />
                );
              }
              // circle or default
              return (
                <div
                  aria-label="Received circle pulse"
                  className="w-8 h-8 rounded-full"
                  style={{ background: color, animation: anim, boxShadow: glow }}
                  title="Pulse • Circle"
                />
              );
            })()}
          </div>
        )}

        {/* Hero Visual (tap/click to send quick reaction when armed) */}
        <div
          id="hero-glow"
          className="mt-12 md:mt-16 animate-float transition-all relative cursor-pointer"
          onClick={() => {
            if (!pairedCode) return;
            if (!reactArmedUntil || Date.now() > reactArmedUntil) return;
            // Debounce
            const now = Date.now();
            if (sendBlockRef.current && now - sendBlockRef.current < 600) return;
            sendBlockRef.current = now;
            // Use received design as reaction
            const payload: any = rxDesign ? { ...rxDesign } : {};
            try { (window as any).plausible?.('Reaction Pulse Sent'); } catch {}
            sendPulse(payload);
            setReactArmedUntil(null);
            // brief flash
            try {
              const el = document.getElementById('hero-glow');
              if (el) {
                const color = (payload && payload.color) || 'rgba(255,92,141,0.6)';
                (el as HTMLElement).style.boxShadow = `0 0 0 4px ${color}`;
                setTimeout(() => { (el as HTMLElement).style.boxShadow = ''; }, 260);
              }
            } catch {}
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // trigger same as click
            const el = document.getElementById('hero-glow');
            if (el) (el as any).click?.();
          }}
        >
          {showReactHint && reactArmedUntil && Date.now() < reactArmedUntil && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-black/60 text-white shadow">
              Tap to react
            </div>
          )}
          <img
            src="/pulse-hero.jpg"
            alt="Two phones connected by a glowing pulse"
            className="w-full max-w-4xl mx-auto h-64 md:h-80 rounded-2xl shadow-2xl ring-1 ring-primary/20 object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

function formatTimeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default Hero;
