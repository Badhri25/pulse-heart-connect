import { Zap, Clock, Palette } from "lucide-react";
import pulseUi from "@/assets/pulse-ui.jpg";

const SolutionSection = () => {
  const features = [
    {
      icon: Zap,
      title: "One-tap pulse",
      description: "Instant glow. Gentle vibration. Pure presence."
    },
    {
      icon: Clock,
      title: "Always in sync",
      description: "See when they last thought of you"
    },
    {
      icon: Palette,
      title: "Make it yours",
      description: "Custom themes coming soon"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-foreground leading-tight">
            PulsePod closes the distance.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            One tap. One gentle pulse. One way to say "I'm thinking of you."
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-5 md:p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl animate-pulse-glow" />
            <img 
              src={pulseUi} 
              alt="PulsePod interface"
              className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl ring-1 ring-primary/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
