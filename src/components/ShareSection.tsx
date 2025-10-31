import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

const ShareSection = () => {
  const handleInvitePartner = () => {
    const subject = encodeURIComponent("Join me on PulsePod 💫");
    const body = encodeURIComponent(
      "I just joined PulsePod — a beautiful way to feel presence without words.\n\nLet's stay connected with gentle pulses instead of endless texts.\n\nJoin the early access: https://pulsepod.app"
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareOnX = () => {
    const tweet = encodeURIComponent(
      "I just joined PulsePod early access — feel presence without words! 💫✨ https://pulsepod.app"
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  };

  return (
    <section className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Spread the Pulse
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Share the magic of presence with those you care about.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleInvitePartner}
            size="lg"
            className="bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 text-foreground hover:bg-card/80 transition-all duration-300 hover:scale-105 group h-14"
          >
            <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse text-primary" />
            Invite your partner
          </Button>

          <Button 
            onClick={handleShareOnX}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-glow-cyan hover:shadow-glow-cyan transition-all duration-300 hover:scale-105 group h-14"
          >
            <Share2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Share on X
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
