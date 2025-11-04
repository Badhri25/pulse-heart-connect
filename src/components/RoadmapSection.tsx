import { Heart, Palette, Users } from "lucide-react";

const RoadmapSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Custom pulse rhythms",
      description: "Create patterns that feel like you"
    },
    {
      icon: Palette,
      title: "Mood-based colors",
      description: "Let your glow reflect how you feel"
    },
    {
      icon: Users,
      title: "Group connections",
      description: "Stay present with friends or your team"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 md:mb-6 text-foreground leading-tight">
          What's next
        </h2>
        <p className="text-center text-base md:text-lg text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
          Help us build what matters to you.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6 md:p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 h-full hover:shadow-glow-cyan hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary mb-4 md:mb-6 group-hover:shadow-glow-cyan transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-muted-foreground">
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
