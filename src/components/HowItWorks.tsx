import { Link2, Hand, Sparkles } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Link2,
      number: "1",
      title: "Pair with your partner",
      description: "Use a short code to connect"
    },
    {
      icon: Hand,
      number: "2", 
      title: "Tap once to send",
      description: "One tap sends your pulse"
    },
    {
      icon: Sparkles,
      number: "3",
      title: "They feel you instantly",
      description: "Presence without words"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="text-center p-8 rounded-2xl bg-glass-bg backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 h-full hover:shadow-glow-cyan group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold mb-6 shadow-glow-cyan group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
