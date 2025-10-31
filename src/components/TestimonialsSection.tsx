const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Even 1000 miles apart, we feel close every day.",
      author: "Early Tester",
      location: "California"
    },
    {
      quote: "PulsePod is our new love language.",
      author: "Couple",
      location: "London"
    },
    {
      quote: "No texts. Just presence. Beautiful.",
      author: "Remote Worker",
      location: "India"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          Why people love it
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in hover:shadow-glow-cyan"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-6">
                <div className="text-4xl text-primary/40 mb-4">"</div>
                <p className="text-lg text-foreground leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
