import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, QrCode, Link as LinkIcon, Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, rtdb } from "@/integrations/firebase";

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const Invite = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [linkCode, setLinkCode] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [claiming, setClaiming] = useState(false);
  const [checking, setChecking] = useState(false); // used during actual claim
  const [checkingHandle, setCheckingHandle] = useState(false); // live availability check
  const [availability, setAvailability] = useState<'idle'|'invalid'|'checking'|'available'|'taken'|'yours'>('idle');
  const code = useMemo(() => randomCode(), []);
  const uid = auth.currentUser?.uid || "anon";
  const pretty = handle ? `${window.location.origin}/p/${handle}` : "";
  const rawJoin = linkCode ? `${window.location.origin}/join/${linkCode}?ref=${uid}` : `${window.location.origin}/join/${code}?ref=${uid}`;
  const qrProviders = [
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pretty || rawJoin)}`,
    `https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=${encodeURIComponent(pretty || rawJoin)}`,
    `https://quickchart.io/qr?size=240&text=${encodeURIComponent(pretty || rawJoin)}`
  ];
  const [qrIndex, setQrIndex] = useState<number>(0);
  const [qrSrc, setQrSrc] = useState<string>(qrProviders[0]);
  const failedOnceRef = useRef<boolean>(false);
  const [qrLoading, setQrLoading] = useState<boolean>(true);

  useEffect(() => {
    setQrIndex(0);
    setQrSrc(qrProviders[0]);
    setQrLoading(true);
    failedOnceRef.current = false;
  }, [rawJoin, pretty]);

  useEffect(() => {
    (window as any).plausible?.("Invite Created");
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pretty || rawJoin);
      toast({ title: "Link copied", description: "Share it with your person to pair instantly." });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      (window as any).plausible?.("Invite Link Copied");
    } catch {
      toast({ title: "Copy failed", description: "Please copy the link manually." });
    }
  };

  const shareLink = async () => {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: "PulsePod Invite", text: "Join my PulsePod pair:", url: (pretty || rawJoin) });
        (window as any).plausible?.("Invite Link Shared");
      } else {
        await copyLink();
      }
    } catch {}
  };

  localStorage.setItem("inviteCode", code);

  useEffect(() => {
    // Load or create stable link code for this user
    const init = async () => {
      try {
        const u = auth.currentUser?.uid;
        if (!u) return;
        const userRef = rtdb.ref(`/users/${u}/linkCode`);
        const snap: any = await userRef.once('value');
        let lc = snap.val();
        if (!lc) {
          lc = randomCode();
          await userRef.set(lc).catch(() => {});
        }
        setLinkCode(lc);
        // Load handle if any
        const hSnap: any = await rtdb.ref(`/users/${u}/handle`).once('value');
        const h = hSnap.val();
        if (h) setHandle(h);
      } catch {}
    };
    init();
  }, []);

  // Live availability check as-you-type
  useEffect(() => {
    const run = async () => {
      const clean = handle.trim().toLowerCase();
      if (!clean) { setAvailability('idle'); return; }
      if (!/^[a-z0-9-]{3,20}$/.test(clean)) { setAvailability('invalid'); return; }
      setCheckingHandle(true);
      setAvailability('checking');
      try {
        const snap: any = await rtdb.ref(`/handles/${clean}`).once('value');
        if (snap.exists()) {
          const val = snap.val() || {};
          if (val.uid && uid && val.uid === uid) setAvailability('yours');
          else setAvailability('taken');
        } else {
          setAvailability('available');
        }
      } catch {
        setAvailability('invalid');
      } finally {
        setCheckingHandle(false);
      }
    };
    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [handle, uid]);

  const claimHandle = async () => {
    if (!uid || uid === 'anon') { toast({ title: 'Login required', description: 'Sign in to claim a Pulse Link.' }); return; }
    const clean = handle.trim().toLowerCase();
    if (!/^[a-z0-9-]{3,20}$/.test(clean)) { toast({ title: 'Invalid handle', description: 'Use 3–20 chars: lowercase letters, numbers, hyphens.' }); return; }
    if (availability === 'taken') { toast({ title: 'Handle taken', description: 'Try another one.' }); return; }
    setClaiming(true);
    try {
      // Ensure linkCode exists
      let lc = linkCode;
      if (!lc) { lc = randomCode(); await rtdb.ref(`/users/${uid}/linkCode`).set(lc); setLinkCode(lc); }
      // Check availability
      setChecking(true);
      const existing: any = await rtdb.ref(`/handles/${clean}`).once('value');
      setChecking(false);
      if (existing.exists()) {
        const val = existing.val() || {};
        if (!(val.uid && uid && val.uid === uid)) {
          toast({ title: 'Handle taken', description: 'Try another one.' });
          return;
        }
      }
      // Claim: write mapping and store handle under user
      await rtdb.ref(`/handles/${clean}`).set({ uid, code: lc });
      await rtdb.ref(`/users/${uid}/handle`).set(clean);
      setHandle(clean);
      toast({ title: 'Pulse Link set', description: `${window.location.origin}/p/${clean}` });
    } catch {
      toast({ title: 'Could not claim', description: 'Please try again.' });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
            Pair Your Pulse
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your invite link or QR code to connect instantly.
          </p>
        </div>

        <Card className="card-gradient border-border/40 bg-card/40 backdrop-blur-md animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Invite Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={pretty || rawJoin} readOnly className="flex-1" aria-label="Invite link" />
              <Button onClick={copyLink} className="gap-2" aria-label="Copy invite link">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy"}
              </Button>
              <Button onClick={shareLink} variant="ghost" className="gap-2 hidden sm:inline-flex" aria-label="Share invite link">
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Anyone with this link can join your pair.
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40 bg-card/40 backdrop-blur-md animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Your Pulse Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase())}
                placeholder="choose-handle"
                aria-label="Pulse link handle"
              />
              <Button
                onClick={claimHandle}
                disabled={claiming || checking || checkingHandle || availability === 'invalid' || (availability === 'taken')}
                className="button-gradient"
              >
                {claiming ? 'Saving…' : availability === 'yours' ? 'Saved' : availability === 'available' ? 'Claim' : 'Claim'}
              </Button>
            </div>
            <div className="text-sm">
              {handle ? (
                <div className={`flex items-center gap-2 ${availability === 'available' ? 'text-emerald-400' : availability === 'taken' ? 'text-rose-400' : availability === 'invalid' ? 'text-amber-400' : 'text-muted-foreground'}`}>
                  <span>{`${window.location.origin}/p/${handle}`}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full ring-1 ring-border/30">
                    {availability === 'checking' ? 'Checking…' : availability === 'available' ? 'Available' : availability === 'taken' ? 'Taken' : availability === 'yours' ? 'Yours' : availability === 'invalid' ? 'Invalid' : ''}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Pick a handle like yourname</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40 bg-card/40 backdrop-blur-md animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Scan QR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-3">
              {qrLoading && (
                <div className="w-[240px] h-[240px] rounded-xl ring-1 ring-border/50 bg-muted/10 animate-pulse" />
              )}
              <img
                key={qrSrc}
                src={qrSrc}
                alt="Pairing QR code"
                className="rounded-xl ring-1 ring-border/50"
                width={240}
                height={240}
                style={{ display: qrLoading ? 'none' : 'block' }}
                onLoad={() => setQrLoading(false)}
                onError={() => {
                  if (qrIndex + 1 < qrProviders.length) {
                    setQrIndex(qrIndex + 1);
                    setQrSrc(qrProviders[qrIndex + 1]);
                    setQrLoading(true);
                  } else {
                    setQrLoading(false);
                  }
                }}
              />
              {!qrLoading && !qrSrc && (
                <div className="text-sm text-muted-foreground text-center">
                  Couldn’t load QR. Share this link instead:
                  <div className="mt-1 text-xs break-all">{pretty || rawJoin}</div>
                </div>
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" /> Open your camera and scan to join.
            </div>
          </CardContent>
        </Card>

        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">Code: <span className="font-semibold tracking-wider">{code}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Invite;
