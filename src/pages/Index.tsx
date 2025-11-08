import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import DemoSection from "@/components/DemoSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import RoadmapSection from "@/components/RoadmapSection";
import WaitlistSection from "@/components/WaitlistSection";
import ShareSection from "@/components/ShareSection";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePulseChannel } from "@/hooks/usePulseChannel";

const Index = () => {
  const [pairId, setPairId] = useState<string | null>(null);
  useEffect(() => { try { setPairId(localStorage.getItem('pairedWith')); } catch {} }, []);
  const { sendPulse, history } = usePulseChannel(pairId);
  const sendBlockRef = useRef<number | null>(null);
  const [sharedBgUnlocked, setSharedBgUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem('sharedBgUnlocked') === '1'; } catch { return false; }
  });
  const [privateFxUnlocked, setPrivateFxUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem('privateEffectsUnlocked') === '1'; } catch { return false; }
  });
  const [showUnlock, setShowUnlock] = useState<null | 'bg' | 'fx'>(null);
  const [sharedBg, setSharedBg] = useState<string>(() => {
    try { return localStorage.getItem('sharedBg') || 'default'; } catch { return 'default'; }
  });
  const bgOptions = [
    { id: 'default', label: 'Classic', style: '' },
    { id: 'aurora', label: 'Aurora', style: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.22), transparent 60%)' },
    { id: 'sunset', label: 'Sunset', style: 'radial-gradient(circle at 20% 80%, rgba(244,63,94,0.24), transparent 60%), radial-gradient(circle at 80% 20%, rgba(234,179,8,0.22), transparent 60%)' },
    { id: 'nebula', label: 'Nebula', style: 'radial-gradient(60% 60% at 50% 50%, rgba(147,51,234,0.28), transparent 65%), radial-gradient(50% 50% at 20% 30%, rgba(59,130,246,0.22), transparent 60%)' },
  ];

  if (pairId) {
    // Clean in-app view: shared space, single pulse button, and history log
    return (
      <>
      <div className="min-h-screen bg-gradient-dark px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60 backdrop-blur-md p-4">
            <div className="aspect-video w-full rounded-xl ring-1 ring-border/30 relative overflow-hidden">
              {sharedBg === 'default' ? (
                <img src="/pulse-hero.jpg" alt="Shared space" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ backgroundImage: bgOptions.find(b=>b.id===sharedBg)?.style || undefined, backgroundColor: 'rgba(0,0,0,0.2)', backgroundBlendMode: 'screen' }} />
              )}
              {privateFxUnlocked && (
                <div className="pointer-events-none absolute inset-0 animate-aurora" style={{ background: 'radial-gradient(40% 40% at 70% 20%, rgba(255,255,255,0.06), transparent), radial-gradient(40% 40% at 30% 80%, rgba(255,255,255,0.05), transparent)' }} />
              )}
            </div>
            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base button-gradient text-white"
                onClick={() => {
                  const now = Date.now();
                  if (sendBlockRef.current && now - sendBlockRef.current < 800) return;
                  sendBlockRef.current = now;
                  let payload: any = {};
                  try { const raw = localStorage.getItem('pulseDesign'); if (raw) payload = JSON.parse(raw); } catch {}
                  sendPulse(payload);
                  if (privateFxUnlocked) {
                    try {
                      const el = document.getElementById('shared-spark');
                      if (el) {
                        el.classList.remove('opacity-0');
                        el.classList.add('opacity-100');
                        setTimeout(() => { el.classList.add('opacity-0'); }, 320);
                      }
                    } catch {}
                  }
                }}
              >
                Send Pulse 💗
              </Button>
            </div>
            <div id="shared-spark" className="pointer-events-none opacity-0 transition-opacity duration-300 absolute inset-0">
              <div className="absolute top-6 left-8 w-16 h-16 rounded-full animate-glow-pulse" style={{ boxShadow: '0 0 48px rgba(255,255,255,0.12)' }} />
              <div className="absolute bottom-8 right-10 w-10 h-10 rounded-full animate-glow-pulse" style={{ boxShadow: '0 0 36px rgba(255,255,255,0.10)' }} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="rounded-xl border bg-card/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Shared Space Background</h3>
                {!sharedBgUnlocked ? (
                  <Button size="sm" onClick={() => setShowUnlock('bg')}>Unlock</Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Unlocked</span>
                )}
              </div>
              {sharedBgUnlocked ? (
                <div className="grid grid-cols-4 gap-3">
                  {bgOptions.map(bg => (
                    <button key={bg.id} onClick={() => { setSharedBg(bg.id); try { localStorage.setItem('sharedBg', bg.id); } catch {} }} className={`h-16 rounded-lg ring-1 ${sharedBg===bg.id ? 'ring-primary' : 'ring-border/40'} overflow-hidden`}> 
                      {bg.id==='default' ? (
                        <img src="/pulse-hero.jpg" alt={bg.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ backgroundImage: bg.style }} />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unlock to choose custom backgrounds for your shared space.</p>
              )}
            </div>

            <div className="rounded-xl border bg-card/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Private Pulse Effects</h3>
                  <p className="text-xs text-muted-foreground">Extra sparkles and glow for you only.</p>
                </div>
                {!privateFxUnlocked ? (
                  <Button size="sm" onClick={() => setShowUnlock('fx')}>Unlock</Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Unlocked</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">History</h2>
            <div className="space-y-2">
              {history.length === 0 && (
                <div className="text-sm text-muted-foreground">No pulses yet.</div>
              )}
              {history.slice().reverse().map((h, idx) => (
                <div key={h.ts + '-' + idx} className="flex items-center justify-between border rounded-md px-3 py-2 bg-card/60">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: h.payload.color || 'hsl(var(--primary))' }} />
                    <div className="text-sm">
                      <div className="font-medium capitalize">{h.payload.shape || 'circle'}</div>
                      <div className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleString()}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => sendPulse(h.payload)}>Replay</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">✨</div>
              <h3 className="text-lg font-semibold">Unlock {showUnlock === 'bg' ? 'Shared Backgrounds' : 'Private Pulse Effects'}</h3>
              <p className="text-sm text-muted-foreground">{showUnlock === 'bg' ? 'Choose beautiful animated backgrounds for your shared space.' : 'Add extra spark and glow to your own device effects.'}</p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => setShowUnlock(null)}>Not now</Button>
              <Button className="flex-1 bg-gradient-to-r from-primary to-purple-500" onClick={() => {
                if (showUnlock === 'bg') { try { localStorage.setItem('sharedBgUnlocked','1'); } catch {}; setSharedBgUnlocked(true); }
                if (showUnlock === 'fx') { try { localStorage.setItem('privateEffectsUnlocked','1'); } catch {}; setPrivateFxUnlocked(true); }
                setShowUnlock(null);
              }}>Unlock</Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  // Marketing page (not paired)
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="section-spacing"><ProblemSection /></div>
      <div className="section-spacing"><SolutionSection /></div>
      <div className="section-spacing"><DemoSection /></div>
      <div className="section-spacing"><HowItWorks /></div>
      <div className="section-spacing"><TestimonialsSection /></div>
      <div className="section-spacing"><RoadmapSection /></div>
      <div className="section-spacing" id="waitlist"><WaitlistSection /></div>
      <div className="section-spacing"><ShareSection /></div>
      <Footer />
    </div>
  );
};

export default Index;
