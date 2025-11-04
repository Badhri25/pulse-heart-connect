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
    <section className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            PulsePod closes the distance.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One tap. One gentle pulse. One way to say "I'm thinking of you."
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
            <img 
              src={pulseUi} 
              alt="PulsePod interface"
              className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
