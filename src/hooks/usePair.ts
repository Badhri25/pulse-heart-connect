import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function usePair() {
  const [code, setCode] = useState<string | null>(() => localStorage.getItem("pair_code"));

  useEffect(() => {
    if (code) localStorage.setItem("pair_code", code);
  }, [code]);

  const createPair = useCallback(async () => {
    let invite = randomCode();
    // Try to insert; if conflict, retry a few times
    for (let i = 0; i < 5; i++) {
      const { error } = await supabase.from("pairs").insert({ code: invite });
      if (!error) {
        setCode(invite);
        return { ok: true, code: invite };
      }
      invite = randomCode();
    }
    return { ok: false, error: new Error("Could not create pair") };
  }, []);

  const joinPair = useCallback(async (invite: string) => {
    const codeTrim = invite.trim().toUpperCase();
    const { data, error } = await supabase.from("pairs").select("code").eq("code", codeTrim).maybeSingle();
    if (error) return { ok: false, error };
    if (!data) return { ok: false, error: new Error("Invalid invite code") };
    setCode(codeTrim);
    return { ok: true, code: codeTrim };
  }, []);

  const inviteLink = useMemo(() => (code ? `${window.location.origin}/?invite=${code}` : null), [code]);

  return { code, createPair, joinPair, inviteLink };
}
