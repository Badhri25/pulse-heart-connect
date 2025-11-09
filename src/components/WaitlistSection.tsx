import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
// Netlify function call; no direct DB write from client

const emailSchema = z.string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .min(5, { message: "Email is too short" })
  .max(255, { message: "Email is too long" });

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Supabase removed for now

  async function submitEarlyAccess(payload: { email: string; name?: string }) {
    const res = await fetch("/.netlify/functions/addEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Submit failed");
    return res.json().catch(() => ({}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email with zod
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const validatedEmail = validation.data.toLowerCase();
    try {
      await submitEarlyAccess({ email: validatedEmail });
    } catch (err) {
      toast.error("Unable to save your email. Please try again.");
      return;
    }

    setIsSubmitted(true);
    toast.success("You’re on the list 💗");
    (window as any).plausible?.('Waitlist Submit');
    setEmail("");
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 md:w-[500px] h-96 md:h-[500px] bg-primary/20 rounded-full blur-3xl animate-heartbeat" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-foreground leading-tight">
          Be part of the first<br />
          <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            100 PulsePairs
          </span>
        </h2>

        {/* Live counter disabled for now */}
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12">
          Join the first wave and help us build something beautiful together.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card/60 backdrop-blur-md border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground h-12 rounded-full px-6"
            />
            <Button 
              type="submit"
              size="lg"
              className="group bg-gradient-cta hover:bg-gradient-cta text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 rounded-full px-8"
            >
              Get Early Access
            </Button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-primary/50 max-w-md mx-auto">
            <p className="text-lg text-primary font-medium">
              You’re on the list 💗
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
