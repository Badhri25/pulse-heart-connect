import disconnectedPhones from "@/assets/disconnected-phones.jpg";

const ProblemSection = () => {
  const problems = [
    "We text every day, but still feel distant.",
    "Long-distance or busy lives make connection harder.",
    "You just want someone to *feel* that you're there."
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
          Words can wait.<br />
          <span className="text-primary">But presence can't.</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="space-y-6 text-left">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-secondary flex-shrink-0" />
                <p className="text-lg text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <img 
              src={disconnectedPhones} 
              alt="Disconnected phones"
              className="w-full rounded-2xl shadow-xl opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
