import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function startOfTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function usePulseCount(refreshMs: number = 5000) {
  const [count, setCount] = useState(0);
  const mounted = useRef(true);

  const fetchCount = useCallback(async () => {
    const since = startOfTodayISO();
    const { count: c } = await supabase
      .from("pulses")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if (typeof c === "number" && mounted.current) setCount(c);
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchCount();

    const channel = supabase
      .channel("pulses-today-count")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pulses" }, (payload) => {
        const created_at = (payload.new as any)?.created_at as string | undefined;
        if (created_at && new Date(created_at) >= new Date(startOfTodayISO())) {
          setCount((x) => x + 1);
        }
      })
      .subscribe();

    const id = window.setInterval(fetchCount, refreshMs);

    return () => {
      mounted.current = false;
      window.clearInterval(id);
      supabase.removeChannel(channel);
    };
  }, [fetchCount, refreshMs]);

  return { count, refresh: fetchCount };
}
