import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePulse(pairCode: string | null, onReceive: (payload: any) => void) {
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pairCode) return;
    const channel = supabase
      .channel(`pulses-${pairCode}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pulses", filter: `pair_code=eq.${pairCode}` }, (payload) => {
        const row = payload.new as any;
        lastIdRef.current = row.id;
        onReceive(row.payload);
        if (navigator.vibrate) navigator.vibrate(50);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pairCode, onReceive]);

  const send = useCallback(async (payload: any) => {
    if (!pairCode) return { ok: false, error: new Error("Not paired") };
    const { error } = await supabase.from("pulses").insert({ pair_code: pairCode, payload });
    if (!error && navigator.vibrate) navigator.vibrate([40, 30, 40]);
    return { ok: !error, error };
  }, [pairCode]);

  return { send };
}
