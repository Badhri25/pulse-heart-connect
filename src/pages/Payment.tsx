import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, DollarSign, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const designData = location.state || {
    shape: "Heart",
    color: "Pink",
    rhythm: "Balanced",
    colorValue: "hsl(var(--primary))",
    animationSpeed: "2s",
  };

  const handlePayment = (method: string) => {
    console.log("Payment initiated with:", method);
    toast({
      title: "Processing Payment...",
      description: `Securely processing your payment via ${method}`,
    });

    // Simulate payment processing
    setTimeout(() => {
      navigate("/thank-you", { state: designData });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
            Complete Your Pulse Purchase
          </h1>
          <p className="text-lg text-muted-foreground">
            One step away from bringing your custom pulse to life.
          </p>
        </div>

        {/* Design Summary Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Custom Pulse
              <div
                className="w-6 h-6 rounded-full ml-auto"
                style={{
                  background: designData.colorValue,
                  animation: `heartbeat ${designData.animationSpeed} ease-in-out infinite`,
                  boxShadow: `0 0 20px ${designData.colorValue}`,
                }}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Shape:</span>
              <span className="font-medium">{designData.shape}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Glow:</span>
              <span className="font-medium">{designData.color}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Rhythm:</span>
              <span className="font-medium">{designData.rhythm}</span>
            </p>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Custom Pulse Design</h3>
              <p className="text-2xl font-bold text-primary">$2.99</p>
            </div>
            <p className="text-sm text-muted-foreground">
              One-time payment • Includes your chosen color, rhythm, and shape • Instant activation
            </p>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handlePayment("Credit/Debit Card")}
              variant="outline"
              className="w-full h-16 text-left justify-start gap-4 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <CreditCard className="w-6 h-6" />
              <div>
                <p className="font-semibold">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment("UPI")}
              variant="outline"
              className="w-full h-16 text-left justify-start gap-4 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <Smartphone className="w-6 h-6" />
              <div>
                <p className="font-semibold">UPI</p>
                <p className="text-xs text-muted-foreground">Google Pay / PhonePe / Paytm</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment("PayPal")}
              variant="outline"
              className="w-full h-16 text-left justify-start gap-4 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <DollarSign className="w-6 h-6" />
              <div>
                <p className="font-semibold">PayPal</p>
                <p className="text-xs text-muted-foreground">Fast & secure checkout</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <p>All payments are securely processed. You'll receive a confirmation email instantly.</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/custom-pulse")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
