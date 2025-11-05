import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroPhones from "@/assets/hero-phones.jpg";

const Hero = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark px-4 py-16 md:py-0">
      {/* Animated gradient wave background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 bg-[length:200%_200%] animate-gradient-wave" />
      
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
            className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-cta hover:bg-gradient-cta text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1 rounded-full"
          >
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </Button>
          
          <Link to="/custom-pulse">
            <Button 
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 rounded-full"
            >
              Customize Your Pulse ✨
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-12 md:mt-16 animate-float">
          <img 
            src={heroPhones} 
            alt="Two phones connected by a glowing pulse"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl ring-1 ring-primary/20"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
