import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Heart, Sparkles, Circle, Rainbow } from "lucide-react";

const CustomPulse = () => {
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<string>("heart");
  const [selectedColor, setSelectedColor] = useState<string>("pink");
  const [pulseSpeed, setPulseSpeed] = useState<number>(50);

  const shapes = [
    { id: "heart", icon: Heart, label: "Heart" },
    { id: "sparkle", icon: Sparkles, label: "Sparkle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "rainbow", icon: Rainbow, label: "Rainbow" },
  ];

  const colors = [
    { id: "pink", name: "Pink", value: "hsl(var(--primary))" },
    { id: "violet", name: "Violet", value: "hsl(280, 70%, 65%)" },
    { id: "blue", name: "Blue", value: "hsl(220, 80%, 60%)" },
    { id: "gold", name: "Gold", value: "hsl(45, 90%, 60%)" },
    { id: "white", name: "White", value: "hsl(0, 0%, 95%)" },
    { id: "multicolor", name: "Multicolor", value: "linear-gradient(135deg, hsl(var(--primary)), hsl(280, 70%, 65%), hsl(220, 80%, 60%))" },
  ];

  const getRhythmLabel = () => {
    if (pulseSpeed < 35) return "Calm";
    if (pulseSpeed < 65) return "Balanced";
    return "Fast";
  };

  const getAnimationSpeed = () => {
    if (pulseSpeed < 35) return "3s";
    if (pulseSpeed < 65) return "2s";
    return "1s";
  };

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

        {/* Main Design Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-8 space-y-8">
            {/* Pulse Shape Selector */}
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

            {/* Glow Color Picker */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Glow Color</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
                      className="w-12 h-12 rounded-full mx-auto mb-2"
                      style={{ background: color.value }}
                    />
                    <p className="text-xs font-medium">{color.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pulse Rhythm Slider */}
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

            {/* Live Preview */}
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-6">Live Preview</h3>
              <div className="flex justify-center">
                <div
                  className="w-32 h-32 rounded-full"
                  style={{
                    background: colors.find(c => c.id === selectedColor)?.value,
                    animation: `heartbeat ${getAnimationSpeed()} ease-in-out infinite`,
                    boxShadow: `0 0 40px ${colors.find(c => c.id === selectedColor)?.value}`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Summary */}
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
                <span className="text-muted-foreground">Rhythm:</span>{" "}
                <span className="font-medium">{getRhythmLabel()}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center space-y-4 animate-fade-in">
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
          >
            Continue to Payment →
          </Button>
          <p className="text-sm text-muted-foreground">
            Free version includes the default pulse. Pro lets you design your own for just $2.99.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomPulse;
