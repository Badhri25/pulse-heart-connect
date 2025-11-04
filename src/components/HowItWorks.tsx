import { Link2, Hand, Sparkles } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Link2,
      number: "1",
      title: "Connect with someone",
      description: "Share a simple code to pair up"
    },
    {
      icon: Hand,
      number: "2", 
      title: "Send a pulse",
      description: "One tap. That's all it takes."
    },
    {
      icon: Sparkles,
      number: "3",
      title: "They feel it instantly",
      description: "Connection without words"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-foreground leading-tight">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="text-center p-6 md:p-8 rounded-2xl bg-glass-bg backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 h-full hover:shadow-glow-cyan hover:-translate-y-1 group">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xl md:text-2xl font-bold mb-4 md:mb-6 shadow-glow-cyan group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-50" />
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
