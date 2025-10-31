import { Button } from "@/components/ui/button";
import heroPhones from "@/assets/hero-phones.jpg";

const Hero = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark px-4">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Send a heartbeat,<br />not a message.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          One tap. One glow. One moment of presence.
        </p>
        
        <Button 
          onClick={scrollToWaitlist}
          size="lg"
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-cyan hover:shadow-glow-cyan transition-all duration-300 hover:scale-105"
        >
          Join Early Access
        </Button>

        {/* Hero Image */}
        <div className="mt-16 animate-float">
          <img 
            src={heroPhones} 
            alt="Two phones connected by a glowing pulse"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
