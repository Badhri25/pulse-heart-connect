import disconnectedPhones from "@/assets/disconnected-phones.jpg";

const ProblemSection = () => {
  const problems = [
    "We text every day, but still feel distant.",
    "Long-distance and busy lives get in the way.",
    "Sometimes you just want them to feel you're there."
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-foreground leading-tight">
          Words can wait.<br />
          <span className="text-primary">But presence can't.</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-12 md:mt-16">
          <div className="space-y-6 text-left">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="group flex items-start gap-4 p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-secondary flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                <p className="text-base md:text-lg text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>
          
          <div className="relative mt-8 md:mt-0">
            <img 
              src={disconnectedPhones} 
              alt="Disconnected phones"
              className="w-full rounded-2xl shadow-xl opacity-80 ring-1 ring-border/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
