import { useEffect, useMemo, useRef, useState } from "react";

export type PulsePayload = {
  color?: string;
  shape?: string;
  rhythmMs?: number;
};

export type PulseEvent = {
  type: "pulse";
  pairId: string;
  ts: number;
  payload: PulsePayload;
};

const CHANNEL_NAME = "pulsepod-realtime";

export function useRealtimePulse(pairId: string | null) {
  const [lastPulse, setLastPulse] = useState<PulseEvent | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  // Init channel when pairId exists
  useEffect(() => {
    if (!pairId) return;

    const bc = new BroadcastChannel(CHANNEL_NAME);
    bcRef.current = bc;

    const onMessage = (ev: MessageEvent) => {
      const data = ev.data as PulseEvent;
      if (!data || data.type !== "pulse") return;
      if (data.pairId !== pairId) return;
      setLastPulse(data);
    };

    bc.addEventListener("message", onMessage);

    // Fallback: listen to storage events for cross-tab
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CHANNEL_NAME || !e.newValue) return;
      try {
        const data = JSON.parse(e.newValue) as PulseEvent;
        if (data.type === "pulse" && data.pairId === pairId) setLastPulse(data);
      } catch {}
    };
    window.addEventListener("storage", onStorage);

    return () => {
      bc.removeEventListener("message", onMessage);
      bc.close();
      window.removeEventListener("storage", onStorage);
      bcRef.current = null;
    };
  }, [pairId]);

  const sendPulse = useMemo(
    () =>
      (payload: PulsePayload = {}) => {
        if (!pairId) return;
        const evt: PulseEvent = {
          type: "pulse",
          pairId,
          ts: Date.now(),
          payload,
        };
        try {
          bcRef.current?.postMessage(evt);
        } catch {}
        try {
          localStorage.setItem(CHANNEL_NAME, JSON.stringify(evt));
          // Clear key to ensure subsequent storage events fire with same key
          localStorage.removeItem(CHANNEL_NAME);
        } catch {}
        // Also update local listener so sender animates too
        setLastPulse(evt);
      },
    [pairId]
  );

  return { sendPulse, lastPulse };
}
