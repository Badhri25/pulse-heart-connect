import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayDemo = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 4500);
  };

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      {/* Background heartbeat glow */}
      <div className="absolute inset-0 animate-pulse-glow opacity-30">
        <div className="absolute top-1/2 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-72 md:w-96 h-72 md:h-96 bg-primary/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-foreground leading-tight">
          Experience the Pulse
        </h2>

        <div className="flex flex-col items-center gap-8">
          {/* Two phones demo */}
          <div className="flex items-center justify-center gap-12 md:gap-20">
            {/* Left phone */}
            <div className="relative">
              <div 
                className={`w-32 h-56 bg-card/60 backdrop-blur-md border-2 border-border rounded-3xl flex items-center justify-center transition-all duration-500 ${
                  isPlaying ? 'animate-pulse-glow shadow-glow-cyan' : ''
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-500 ${
                    isPlaying ? 'scale-110 shadow-glow-cyan' : 'scale-75 opacity-60'
                  }`}
                />
              </div>
              <p className="text-center mt-3 text-sm text-muted-foreground">You</p>
            </div>

            {/* Pulse wave connector */}
            <div className="hidden md:block relative w-32">
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  isPlaying ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
                <div className="absolute w-3 h-3 rounded-full bg-primary animate-ping" />
              </div>
            </div>

            {/* Right phone */}
            <div className="relative">
              <div 
                className={`w-32 h-56 bg-card/60 backdrop-blur-md border-2 border-border rounded-3xl flex items-center justify-center transition-all duration-500 delay-300 ${
                  isPlaying ? 'animate-pulse-glow shadow-glow-purple' : ''
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary transition-all duration-500 delay-300 ${
                    isPlaying ? 'scale-110 shadow-glow-purple' : 'scale-75 opacity-60'
                  }`}
                />
              </div>
              <p className="text-center mt-3 text-sm text-muted-foreground">Your partner</p>
            </div>
          </div>

          {/* Sequence labels */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className={isPlaying ? 'text-primary font-medium' : ''}>Tap</span>
            <span>→</span>
            <span className={isPlaying ? 'text-primary font-medium' : ''}>Glow</span>
            <span>→</span>
            <span className={isPlaying ? 'text-primary font-medium' : ''}>Vibration</span>
            <span>→</span>
            <span className={isPlaying ? 'text-primary font-medium' : ''}>Smile</span>
          </div>

          {/* Play button */}
          <Button 
            onClick={handlePlayDemo}
            disabled={isPlaying}
            size="lg"
            className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-8 py-6"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            {isPlaying ? 'Playing...' : 'Play Demo'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
