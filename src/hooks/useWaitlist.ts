import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWaitlist() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      const { data } = await supabase.rpc("get_waitlist_count");
      if (typeof data === "number" && isMounted) setCount(data);
    };

    fetchCount();

    const channel = supabase
      .channel("waitlist-inserts-hook")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "waitlist" }, () => {
        setCount((c) => c + 1);
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const join = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({ email: email.toLowerCase() });
      if (error) throw error;
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, []);

  return { count, loading, join };
}
