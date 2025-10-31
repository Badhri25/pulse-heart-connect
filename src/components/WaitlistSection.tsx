import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    toast.success("You're on the list! Stay tuned for your first pulse 💫");
    setEmail("");
  };

  return (
    <section id="waitlist" className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Be part of the first<br />
          <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            100 PulsePairs
          </span>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-12">
          We're inviting early users to shape the future of digital presence.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card/60 backdrop-blur-md border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
            />
            <Button 
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-cyan hover:shadow-glow-cyan transition-all duration-300 hover:scale-105 animate-pulse-glow h-12"
            >
              Get Early Access
            </Button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-primary/50 max-w-md mx-auto">
            <p className="text-lg text-primary font-medium">
              ✨ You're on the list! Stay tuned for your first pulse 💫
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-8">
          No spam, just presence. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default WaitlistSection;
