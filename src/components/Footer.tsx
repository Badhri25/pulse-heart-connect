import { Shield, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-background border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p className="text-center md:text-left">© PulsePod 2025 | Built with ❤️ by Badhri Srinivasan</p>
          
          <div className="flex gap-6">
            <Link to="/privacy" className="group flex items-center gap-2 hover:text-primary transition-colors">
              <Shield className="w-4 h-4" />
              <span className="relative">
                Privacy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            <Link to="/terms" className="group flex items-center gap-2 hover:text-primary transition-colors">
              <FileText className="w-4 h-4" />
              <span className="relative">
                Terms
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            <Link to="/contact" className="group flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              <span className="relative">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
