import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PulsePod Terms of Service";
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: November 5, 2025</p>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Contents</h2>
            <nav className="space-y-2">
              <a href="#acceptance" className="block text-primary hover:underline">Acceptance of Terms</a>
              <a href="#eligibility" className="block text-primary hover:underline">Eligibility & Accounts</a>
              <a href="#license" className="block text-primary hover:underline">License & Acceptable Use</a>
              <a href="#early-access" className="block text-primary hover:underline">Early Access & Beta Disclaimer</a>
              <a href="#payments" className="block text-primary hover:underline">Payments</a>
              <a href="#intellectual-property" className="block text-primary hover:underline">Intellectual Property</a>
              <a href="#user-content" className="block text-primary hover:underline">User Content</a>
              <a href="#third-party" className="block text-primary hover:underline">Third-Party Services</a>
              <a href="#warranties" className="block text-primary hover:underline">Warranties & Disclaimers</a>
              <a href="#limitation" className="block text-primary hover:underline">Limitation of Liability</a>
              <a href="#indemnification" className="block text-primary hover:underline">Indemnification</a>
              <a href="#termination" className="block text-primary hover:underline">Termination</a>
              <a href="#governing-law" className="block text-primary hover:underline">Governing Law & Dispute Resolution</a>
              <a href="#changes-to-terms" className="block text-primary hover:underline">Changes to Terms</a>
              <a href="#contact" className="block text-primary hover:underline">Contact</a>
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            <section id="acceptance">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Acceptance of Terms</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>By accessing or using PulsePod, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="eligibility">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Eligibility & Accounts</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You must be at least 13 years old (or 16 in some regions) to use PulsePod. By joining early access, you agree to provide accurate information and maintain the security of your account credentials.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="license">
              <h2 className="text-2xl font-bold mb-4 text-foreground">License & Acceptable Use</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We grant you a limited, non-exclusive, non-transferable license to access and use PulsePod for personal, non-commercial purposes.</p>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Abuse, harass, or harm others</li>
                  <li>Reverse engineer or decompile the service</li>
                  <li>Use PulsePod for unlawful purposes</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="early-access">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Early Access & Beta Disclaimer</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>PulsePod is currently in early access. The service may change, have limited availability, or contain bugs. We appreciate your patience and feedback as we build something beautiful together.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="payments">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Payments</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>The landing page and waitlist are free. In the future, we may offer optional Pro features with billing. Any paid features will be clearly disclosed before purchase.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="intellectual-property">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>All content, code, designs, and branding related to PulsePod are owned by PulsePod or licensed to us. You may not copy, modify, or distribute our intellectual property without permission.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="user-content">
              <h2 className="text-2xl font-bold mb-4 text-foreground">User Content</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>If you submit feedback, suggestions, or other content, you grant us a non-exclusive license to use that content to improve PulsePod. You retain ownership of any content you create.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="third-party">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Third-Party Services</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>PulsePod may use third-party services for analytics, hosting, and other functions. These services have their own terms and privacy policies.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="warranties">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Warranties & Disclaimers</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>PulsePod is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the service will be error-free, secure, or always available.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="limitation">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>To the maximum extent permitted by law, PulsePod and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="indemnification">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Indemnification</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You agree to indemnify and hold harmless PulsePod from any claims, damages, or expenses arising from your use of the service or violation of these Terms.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="termination">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Termination</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We may suspend or terminate your access to PulsePod at any time for violations of these Terms or other reasonable cause. You may stop using the service at any time.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="governing-law">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Governing Law & Dispute Resolution</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Tamil Nadu, India.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="changes-to-terms">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to Terms</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We may update these Terms from time to time. When we do, we'll update the "Last updated" date and post the changes here. Continued use of PulsePod constitutes acceptance of the updated Terms.</p>
              </div>
            </section>

            <div className="border-t border-border/30" />

            <section id="contact">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>If you have questions about these Terms, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.</p>
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

export default Terms;
