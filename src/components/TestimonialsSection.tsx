const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "We're a thousand miles apart, but I feel him with me every day.",
      author: "Sarah M.",
      location: "California"
    },
    {
      quote: "This became our love language. Simple, sweet, and so us.",
      author: "Alex & Jordan",
      location: "London"
    },
    {
      quote: "No need for words. Just knowing she's there is everything.",
      author: "Ravi K.",
      location: "Mumbai"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-foreground leading-tight">
          Why people love it
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in hover:shadow-glow-cyan hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-6">
                <div className="text-3xl md:text-4xl text-primary/40 mb-4 group-hover:text-primary/60 transition-colors duration-300">"</div>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300" />
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
