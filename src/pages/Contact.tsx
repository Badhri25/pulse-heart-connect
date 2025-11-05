import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Mail, Phone, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import Footer from "@/components/Footer";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" })
});

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact PulsePod";
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const validatedData = validation.data;

    // Save to waitlist table with additional contact info
    const { error } = await supabase
      .from('waitlist')
      .insert({ 
        email: validatedData.email.toLowerCase(),
        metadata: {
          name: validatedData.name,
          message: validatedData.message,
          type: 'contact'
        }
      });

    if (error) {
      toast.error("Something went wrong. Please try again or email us directly.");
      return;
    }

    setIsSubmitted(true);
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Contact</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you.</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Contact Cards */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h2>

              {/* Email */}
              <a
                href="mailto:badhrisrinivasan2503@gmail.com"
                className="block p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">badhrisrinivasan2503@gmail.com</p>
                  </div>
                </div>
              </a>

              {/* Phone/WhatsApp */}
              <a
                href="tel:+919384187962"
                className="block p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone / WhatsApp</h3>
                    <p className="text-muted-foreground text-sm">+91 9384187962</p>
                  </div>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/badhri-srinivasan-a3805b218/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">LinkedIn</h3>
                    <p className="text-muted-foreground text-sm">Badhri Srinivasan</p>
                  </div>
                </div>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/BadhriSrin31509"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Twitter className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">X (Twitter)</h3>
                    <p className="text-muted-foreground text-sm">@BadhriSrin31509</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Right: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Send a Message</h2>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-card/60 backdrop-blur-md border-border/50 focus:border-primary h-12 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-card/60 backdrop-blur-md border-border/50 focus:border-primary h-12 rounded-2xl"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-card/60 backdrop-blur-md border-border/50 focus:border-primary rounded-2xl min-h-[150px] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group bg-gradient-cta hover:bg-gradient-cta text-white font-semibold shadow-glow-pink hover:shadow-glow-purple transition-all duration-300 hover:scale-105 h-12 rounded-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-primary/50 text-center">
                  <p className="text-lg text-primary font-medium">
                    ✨ Thanks for reaching out! We'll get back to you soon.
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-6 text-center">
                By contacting us, you agree to our{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                {" "}and{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
