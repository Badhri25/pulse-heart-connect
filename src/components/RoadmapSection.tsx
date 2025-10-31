import { Heart, Palette, Users } from "lucide-react";

const RoadmapSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Custom pulse patterns",
      description: "Create your own rhythm"
    },
    {
      icon: Palette,
      title: "Mood-based glow colors",
      description: "Express how you feel"
    },
    {
      icon: Users,
      title: "Team Pulse mode",
      description: "For friends & remote teams"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
          What's next
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Join early to help shape the future.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary mb-6 group-hover:shadow-glow-cyan transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
