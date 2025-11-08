import { Button } from "@/components/ui/button";
import { Heart, Share2, Copy, Twitter, MessageCircle } from "lucide-react";

const ShareSection = () => {
  const referral = `https://pulsepod.app/invite?ref=USERNAME`;

  const handleInvitePartner = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      (window as any).plausible?.('Invite Partner Copy');
      // Optional: small visual feedback via console; UI toast is handled globally
      console.log('Referral link copied:', referral);
    } catch (e) {
      console.warn('Copy failed');
    }
  };

  const handleShareOnX = () => {
    const text = encodeURIComponent("I just found PulsePod — a 1-tap way to feel someone’s presence 💗 pulsepod.app");
    (window as any).plausible?.('Social Share - X');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareOnWhatsApp = () => {
    const text = encodeURIComponent("I just found PulsePod — a 1-tap way to feel someone’s presence 💗 pulsepod.app");
    (window as any).plausible?.('Social Share - WhatsApp');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-dark relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-foreground leading-tight">
          Spread the Pulse
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12">
          Share the magic of presence with those you care about.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleInvitePartner}
            size="lg"
            className="group bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 text-foreground hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14 rounded-full"
          >
            <Copy className="w-5 h-5 mr-2 text-primary" />
            Invite Your Partner
          </Button>

          <Button 
            onClick={handleShareOnX}
            size="lg"
            className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14 rounded-full"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Share on X
          </Button>

          <Button 
            onClick={handleShareOnWhatsApp}
            size="lg"
            variant="outline"
            className="group border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 h-12 md:h-14 rounded-full"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Share on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
