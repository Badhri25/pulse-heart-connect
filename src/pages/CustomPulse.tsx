import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Heart, Sparkles, Circle, Diamond, Lock } from "lucide-react";

const CustomPulse = () => {
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<string>("heart");
  const [selectedColor, setSelectedColor] = useState<string>("pink");
  const [customHex, setCustomHex] = useState<string>("#FF5C8D");
  const [intensity, setIntensity] = useState<'soft' | 'normal' | 'strong'>("normal");
  const [pulseSpeed, setPulseSpeed] = useState<number>(50);
  const [simpleMode, setSimpleMode] = useState<boolean>(true);
  const [premiumUnlocked, setPremiumUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem('premiumUnlocked') === '1'; } catch { return false; }
  });
  const [showUnlock, setShowUnlock] = useState<boolean>(false);
  const [pendingTheme, setPendingTheme] = useState<{ id?: string; label?: string; shape: string; color: string; rhythmMs: number; intensity: 'soft'|'normal'|'strong'; premium?: boolean } | null>(null);

  const shapes = [
    { id: "heart", icon: Heart, label: "Heart" },
    { id: "sparkle", icon: Sparkles, label: "Sparkle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "diamond", icon: Diamond, label: "Diamond" },
  ];

  const colors = [
    { id: "pink", name: "Pink", value: "hsl(330, 85%, 50%)" },
    { id: "rose", name: "Rose", value: "hsl(350, 80%, 48%)" },
    { id: "violet", name: "Violet", value: "hsl(280, 70%, 50%)" },
    { id: "blue", name: "Blue", value: "hsl(220, 80%, 50%)" },
    { id: "gold", name: "Gold", value: "hsl(45, 85%, 50%)" },
  ];

  const presets = [
    { id: "rose", label: "Rose Glow", shape: "heart", color: "pink", speed: 60 },
    { id: "ocean", label: "Ocean Blue", shape: "circle", color: "blue", speed: 45 },
    { id: "spark", label: "Soft Spark", shape: "sparkle", color: "violet", speed: 50 },
    { id: "sunset", label: "Sunset Amber", shape: "circle", color: "gold", speed: 55 },
  ];

  const themes = [
    { id: 'valentine', label: 'Valentine Glow', shape: 'heart', color: '#FF4D7E', rhythmMs: 1400, intensity: 'strong' as const, premium: true },
    { id: 'calmblue', label: 'CalmBlue', shape: 'circle', color: 'hsl(220, 80%, 45%)', rhythmMs: 2200, intensity: 'soft' as const },
    { id: 'festival', label: 'Festival Spark', shape: 'sparkle', color: 'hsl(45, 90%, 55%)', rhythmMs: 1600, intensity: 'normal' as const, premium: true },
    { id: 'deepviolet', label: 'Deep Violet', shape: 'diamond', color: 'hsl(280, 70%, 50%)', rhythmMs: 1800, intensity: 'normal' as const },
    { id: 'neon', label: 'Neon Cyan', shape: 'circle', color: 'hsl(189, 94%, 43%)', rhythmMs: 1200, intensity: 'strong' as const, premium: true },
    { id: 'aurora', label: 'Aurora Mist', shape: 'sparkle', color: 'hsl(260, 80%, 65%)', rhythmMs: 2000, intensity: 'soft' as const },
    { id: 'lava', label: 'Lava Pulse', shape: 'heart', color: 'hsl(12, 90%, 55%)', rhythmMs: 900, intensity: 'strong' as const, premium: true },
    { id: 'arctic', label: 'Arctic Ring', shape: 'diamond', color: 'hsl(205, 90%, 65%)', rhythmMs: 2400, intensity: 'soft' as const },
  ];

  // Load default preset on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('defaultPulseDesign');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.shape) setSelectedShape(d.shape);
        if (d.color) setSelectedColor(d.color);
        if (d.customHex) setCustomHex(d.customHex);
        if (d.intensity) setIntensity(d.intensity);
        if (typeof d.speed === 'number') setPulseSpeed(d.speed);
      }
    } catch {}
  }, []);

  const applyPreset = (p: { shape: string; color: string; speed: number }) => {
    setSelectedShape(p.shape);
    setSelectedColor(p.color);
    setPulseSpeed(p.speed);
  };

  const saveAsDefault = () => {
    try {
      localStorage.setItem('defaultPulseDesign', JSON.stringify({ shape: selectedShape, color: selectedColor, customHex, speed: pulseSpeed, intensity }));
    } catch {}
  };

  const applyTheme = (t: { shape: string; color: string; rhythmMs: number; intensity: 'soft'|'normal'|'strong'; id?: string }) => {
    setSelectedShape(t.shape);
    setSelectedColor('custom');
    setCustomHex(t.color);
    const speed = t.rhythmMs <= 1200 ? 80 : t.rhythmMs <= 1800 ? 55 : 30;
    setPulseSpeed(speed);
    setIntensity(t.intensity);
    try {
      localStorage.setItem('pulseDesign', JSON.stringify({ shape: t.shape, color: t.color, rhythmMs: t.rhythmMs, intensity: t.intensity, themeId: t.id || null }));
    } catch {}
  };

  const getRhythmLabel = () => {
    if (pulseSpeed < 35) return "Calm";
    if (pulseSpeed < 65) return "Balanced";
    return "Fast";
  };

  const currentColorValue = selectedColor === 'custom'
    ? customHex
    : (colors.find(c => c.id === selectedColor)?.value || "hsl(var(--primary))");

  const intensityShadow = () => {
    if (intensity === 'soft') return '0 0 24px';
    if (intensity === 'strong') return '0 0 64px';
    return '0 0 40px';
  };

  const renderPreview = () => {
    const commonShadow = `${intensityShadow()} ${currentColorValue}`;
    const sizeCls = "w-32 h-32";
    const animation = `heartbeat ${getAnimationSpeed()} ease-in-out infinite`;

    if (selectedShape === 'circle') {
      return (
        <div
          className={`${sizeCls} rounded-full`}
          style={{
            background: currentColorValue,
            animation,
            boxShadow: commonShadow,
          }}
          aria-label={`${selectedColor} ${selectedShape} pulse preview`}
        />
      );
    }

    if (selectedShape === 'heart') {
      return (
        <div className="flex items-center justify-center" aria-label={`${selectedColor} heart pulse preview`}>
          <Heart
            className="w-28 h-28"
            style={{ color: currentColorValue, filter: `drop-shadow(${intensity === 'soft' ? '0 0 12px' : intensity === 'strong' ? '0 0 28px' : '0 0 18px'} rgba(255,92,141,0.45))`, animation }}
          />
        </div>
      );
    }

    if (selectedShape === 'sparkle') {
      return (
        <div className="flex items-center justify-center" aria-label={`${selectedColor} sparkle pulse preview`}>
          <Sparkles
            className="w-28 h-28"
            style={{ color: currentColorValue, filter: `drop-shadow(${intensity === 'soft' ? '0 0 10px' : intensity === 'strong' ? '0 0 26px' : '0 0 16px'} rgba(255,92,141,0.45))`, animation }}
          />
        </div>
      );
    }

    if (selectedShape === 'diamond') {
      return (
        <div
          className="flex items-center justify-center"
          aria-label={`${selectedColor} diamond pulse preview`}
        >
          <div
            className="w-28 h-28"
            style={{
              background: currentColorValue,
              boxShadow: commonShadow,
              animation,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          />
        </div>
      );
    }

    // Fallback
    return (
      <div
        className={`${sizeCls} rounded-full`}
        style={{ background: currentColorValue, animation, boxShadow: commonShadow }}
        aria-label={`${selectedColor} pulse preview`}
      />
    );
  };

  const getAnimationSpeed = () => {
    if (pulseSpeed < 35) return "3s";
    if (pulseSpeed < 65) return "2s";
    return "1s";
  };

  const getRhythmMs = () => {
    if (pulseSpeed < 35) return 3000;
    if (pulseSpeed < 65) return 2000;
    return 1000;
  };

  // Persist current design for synced pulses
  useEffect(() => {
    try {
      const payload = {
        shape: selectedShape,
        color: currentColorValue,
        rhythmMs: getRhythmMs(),
        intensity,
      };
      localStorage.setItem('pulseDesign', JSON.stringify(payload));
    } catch {}
  }, [selectedShape, currentColorValue, pulseSpeed, intensity]);

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        shape: shapes.find(s => s.id === selectedShape)?.label,
        color: colors.find(c => c.id === selectedColor)?.name,
        rhythm: getRhythmLabel(),
        colorValue: colors.find(c => c.id === selectedColor)?.value,
        animationSpeed: getAnimationSpeed(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
            Design Your Pulse
          </h1>
          <p className="text-xl text-muted-foreground">
            Create your own rhythm — your heartbeat, your style.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm border ${simpleMode ? 'bg-primary text-white border-primary' : 'border-border'}`}
            onClick={() => setSimpleMode(true)}
          >
            Simple
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm border ${!simpleMode ? 'bg-primary text-white border-primary' : 'border-border'}`}
            onClick={() => setSimpleMode(false)}
          >
            Advanced
          </button>
        </div>

        {/* Main Design Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-8 space-y-8">
            {!simpleMode && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pulse Shape</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shapes.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => setSelectedShape(shape.id)}
                          className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                            selectedShape === shape.id
                              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                              : "border-border/50 hover:border-primary/50"
                          }`}
                        >
                          <Icon className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">{shape.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Glow Color</h3>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                          selectedColor === color.id
                            ? "border-primary shadow-lg shadow-primary/20"
                            : "border-border/50 hover:border-primary/50"
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-full mx-auto mb-2 ring-1 ring-white/10"
                          style={{ background: color.value }}
                        />
                        <p className="text-xs font-medium">{color.name}</p>
                      </button>
                    ))}
                    <label className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedColor==='custom' ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50 hover:border-primary/50'}`}>
                      <div className="text-xs font-medium mb-2">Custom</div>
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 ring-1 ring-white/10" style={{ background: customHex }} />
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => { setCustomHex(e.target.value); setSelectedColor('custom'); }}
                        className="sr-only"
                        aria-label="Custom color"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Pulse Speed</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Current: <span className="font-semibold text-foreground">{getRhythmLabel()}</span>
                  </p>
                  <Slider
                    value={[pulseSpeed]}
                    onValueChange={(value) => setPulseSpeed(value[0])}
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Calm</span>
                    <span>Balanced</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Pulse Intensity</h3>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {(['soft','normal','strong'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setIntensity(level)}
                        className={`p-4 rounded-lg border-2 text-sm capitalize transition-all ${
                          intensity === level ? 'border-primary bg-primary/10 shadow-primary/20 shadow' : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="text-center pb-2">
              <h3 className="text-lg font-semibold mb-4">Themes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {(simpleMode ? themes.slice(0,4) : themes).map((t) => {
                  const locked = !!t.premium && !premiumUnlocked;
                  return (
                    <button
                      key={t.id}
                      className={`group relative p-4 rounded-xl border bg-card/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${locked ? 'hover:border-border/60' : 'hover:border-primary/60 hover:shadow-md'}`}
                      onClick={() => {
                        if (locked) { setPendingTheme(t); setShowUnlock(true); return; }
                        applyTheme(t);
                      }}
                      aria-label={`Apply theme ${t.label}`}
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-lg ring-1 ring-border/40 relative overflow-hidden grid place-items-center group-hover:ring-primary/50" style={{ boxShadow: `0 0 30px ${t.color}33 inset` }}>
                          <div className="absolute -inset-6 opacity-60 animate-aurora" style={{ background: `radial-gradient(60% 60% at 30% 30%, ${t.color}33, transparent), radial-gradient(60% 60% at 70% 70%, ${t.color}22, transparent)` }} />
                          {t.shape === 'heart' && (
                            <Heart className="w-9 h-9" style={{ color: t.color, animation: 'heartbeat 1.6s ease-in-out infinite' }} />
                          )}
                          {t.shape === 'sparkle' && (
                            <Sparkles className="w-9 h-9" style={{ color: t.color, animation: 'twinkle 1.4s ease-in-out infinite' }} />
                          )}
                          {t.shape === 'circle' && (
                            <div className="w-10 h-10 rounded-full animate-glow-pulse" style={{ background: t.color, boxShadow: `0 0 32px ${t.color}66` }} />
                          )}
                          {t.shape === 'diamond' && (
                            <div className="w-10 h-10 animate-glow-pulse" style={{ background: t.color, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', boxShadow: `0 0 32px ${t.color}66` }} />
                          )}
                          <div className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-primary/30 transition" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <span>{t.label}</span>
                            {locked && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"><Lock className="w-3 h-3" />Premium</span>}
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/90">{Math.round(60000 / t.rhythmMs)} BPM</span>
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">{t.shape} · {t.intensity}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-6">Live Preview</h3>
              <div className="flex justify-center relative">
                {renderPreview()}
              </div>
            </div>

            <div className="text-center pb-8">
              {!simpleMode && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Preset Glows</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {presets.map((p) => {
                      const cVal = colors.find(c => c.id === p.color)?.value || 'hsl(var(--primary))';
                      return (
                        <button
                          key={p.id}
                          className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:border-primary"
                          onClick={() => applyPreset({ shape: p.shape, color: p.color, speed: p.speed })}
                        >
                          <div className="w-16 h-16 rounded-full mx-auto mb-2" style={{ background: cVal, boxShadow: '0 0 24px rgba(0,0,0,0.15)' }} />
                          <span className="text-sm font-medium">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="mt-4">
                <button className="text-sm px-4 py-2 border rounded-md hover:bg-primary/10" onClick={saveAsDefault}>Save current as default</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showUnlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
              <div className="text-center space-y-2 mb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Unlock Premium Themes</h3>
                <p className="text-sm text-muted-foreground">Get access to exclusive glow styles and special pulse animations.</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => { setShowUnlock(false); setPendingTheme(null); }}>Not now</Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-purple-500"
                  onClick={() => {
                    try { localStorage.setItem('premiumUnlocked', '1'); } catch {}
                    setPremiumUnlocked(true);
                    setShowUnlock(false);
                    if (pendingTheme) applyTheme(pendingTheme);
                    setPendingTheme(null);
                  }}
                >
                  Unlock
                </Button>
              </div>
            </div>
          </div>
        )}
        {!simpleMode && (
          <>
            <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Design Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Shape:</span>{" "}
                    <span className="font-medium">{shapes.find(s => s.id === selectedShape)?.label}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Glow:</span>{" "}
                    <span className="font-medium">{colors.find(c => c.id === selectedColor)?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Intensity:</span>{" "}
                    <span className="font-medium capitalize">{intensity}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Rhythm:</span>{" "}
                    <span className="font-medium">{getRhythmLabel()}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4 animate-fade-in">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
              >
                Continue to Payment →
              </Button>
              <p className="text-sm text-muted-foreground">
                Free version includes the default pulse. Pro lets you design your own for just $1.99.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
;

export default CustomPulse;
