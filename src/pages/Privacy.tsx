import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PulsePod Privacy Policy";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: November 5, 2025</p>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              At PulsePod, we respect your privacy. This policy explains how we collect, use, and protect your information as we build something beautiful together during early access.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Contents</h2>
            <nav className="space-y-2">
              <a href="#information-we-collect" className="block text-primary hover:underline">Information We Collect</a>
              <a href="#how-we-use" className="block text-primary hover:underline">How We Use Information</a>
              <a href="#cookies-analytics" className="block text-primary hover:underline">Cookies & Analytics</a>
              <a href="#data-sharing" className="block text-primary hover:underline">Data Sharing</a>
              <a href="#data-retention" className="block text-primary hover:underline">Data Retention</a>
              <a href="#your-rights" className="block text-primary hover:underline">Your Rights</a>
              <a href="#security" className="block text-primary hover:underline">Security</a>
              <a href="#childrens-privacy" className="block text-primary hover:underline">Children's Privacy</a>
              <a href="#international-transfers" className="block text-primary hover:underline">International Transfers</a>
              <a href="#changes" className="block text-primary hover:underline">Changes to This Policy</a>
              <a href="#contact-us" className="block text-primary hover:underline">Contact Us</a>
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            <section id="information-we-collect">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>During early access, we collect minimal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Email address</strong> when you join the waitlist</li>
                  <li><strong>Analytics events</strong> like page views and referrers (via privacy-friendly analytics)</li>
                  <li><strong>Device and browser information</strong> to improve compatibility</li>
                </ul>
                <p>We do not collect sensitive personal categories like health data, financial information, or precise location.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="how-we-use">
              <h2 className="text-2xl font-bold mb-4 text-foreground">How We Use Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact you about early access and product updates</li>
                  <li>Improve PulsePod's performance and user experience</li>
                  <li>Understand how people use the site to make it better</li>
                  <li>Respond to your questions and feedback</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="cookies-analytics">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies & Analytics</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use privacy-friendly analytics (Plausible) to understand site usage. This service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Does not use cookies</li>
                  <li>Does not track you across websites</li>
                  <li>Does not collect personal information</li>
                  <li>Aggregates data without identifying individuals</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="data-sharing">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Data Sharing</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We do not sell your data. We may share information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service providers</strong> who help us host and run PulsePod (e.g., cloud hosting)</li>
                  <li><strong>Analytics providers</strong> for privacy-friendly usage insights</li>
                  <li><strong>Legal authorities</strong> if required by law or to protect rights and safety</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="data-retention">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Data Retention</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We keep your information only as long as needed for early access and product updates. You can request deletion at any time by contacting us.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="your-rights">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Your Rights</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the information we have about you</li>
                  <li>Update or correct your information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of communications</li>
                </ul>
                <p>To exercise these rights, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="security">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Security</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use reasonable safeguards to protect your information, including secure hosting and encryption. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="childrens-privacy">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Children's Privacy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>PulsePod is not directed to children under 13 (or 16 in some regions). We do not knowingly collect information from children. If you believe we have, please contact us immediately.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="international-transfers">
              <h2 className="text-2xl font-bold mb-4 text-foreground">International Transfers</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Your data may be processed and stored in servers located outside your country of residence. We ensure appropriate safeguards are in place.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="changes">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Policy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date and post the changes here. Continued use of PulsePod constitutes acceptance of the updated policy.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="contact-us">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>If you have questions about this Privacy Policy, please <Link to="/contact" className="text-primary hover:underline">get in touch</Link>.</p>
              </div>
            </section>
          </div>

          {/* Back to Top */}
          <div className="mt-16 text-center">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="outline"
              className="rounded-full"
            >
              Back to Top
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
