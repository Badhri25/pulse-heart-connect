import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";
import { auth, rtdb } from "@/integrations/firebase";

const Join = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const refUid = search.get('ref');

  const joinPair = () => {
    if (!code) return;
    localStorage.setItem("pairedWith", code);
    // Record referral if present and not self
    try {
      const uid = auth.currentUser?.uid || null;
      if (refUid && (!uid || refUid !== uid)) {
        const key = Date.now();
        rtdb.ref(`/referrals/${refUid}/${code}/${key}`).set({ joinedAt: key }).catch(() => {});
      }
    } catch {}
    toast({ title: "Paired", description: "You’re now connected. Send your first pulse!" });
    (window as any).plausible?.("Join Pair Success");
    navigate("/");
  };

  const link = `${window.location.origin}/join/${code ?? ""}`;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
            Join Pair
          </h1>
          <p className="text-lg text-muted-foreground">
            Accept the invite to connect and start sending pulses.
          </p>
        </div>

        <Card className="card-gradient border-border/40 bg-card/40 backdrop-blur-md animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground break-all flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> {link}
            </div>
            <div className="flex justify-center">
              <Button onClick={joinPair} size="lg" className="gap-2 button-gradient">
                <CheckCircle2 className="w-5 h-5" /> Accept & Pair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Join;
