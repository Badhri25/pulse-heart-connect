import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rtdb } from "@/integrations/firebase";

const PulseLink = () => {
  const { handle } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!handle) return;
    const ref = rtdb.ref(`/handles/${handle}`);
    ref.once('value', (snap: any) => {
      const val = snap.val();
      if (val && val.code) {
        const code = val.code;
        const refUid = val.uid || "";
        const qs = refUid ? `?ref=${encodeURIComponent(refUid)}` : "";
        navigate(`/join/${code}${qs}`, { replace: true });
      } else {
        navigate('/invite', { replace: true });
      }
    });
  }, [handle]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Resolving link…
    </div>
  );
};

export default PulseLink;
