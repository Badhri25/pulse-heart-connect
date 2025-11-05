import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Share2 } from "lucide-react";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const designData = location.state || {
    colorValue: "hsl(var(--primary))",
    animationSpeed: "2s",
  };

  const handleShare = () => {
    const shareText = "I just designed my custom pulse on PulsePod! 💖 Feel presence, not distance.";
    const shareUrl = window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: "PulsePod - My Custom Pulse",
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      console.log("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in text-center">
          <CardContent className="p-12 space-y-8">
            {/* Animated Pulse */}
            <div className="flex justify-center mb-6">
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  background: designData.colorValue,
                  animation: `heartbeat ${designData.animationSpeed} ease-in-out infinite`,
                  boxShadow: `0 0 60px ${designData.colorValue}`,
                }}
              />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                ✨ Your custom pulse is alive!
              </h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Share your design and invite your partner to feel it.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={handleShare}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Invite Partner
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                variant="outline"
                className="hover:bg-primary/10 transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Return Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                Your custom pulse has been activated
              </p>
              <p>Check your email for confirmation and next steps</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
