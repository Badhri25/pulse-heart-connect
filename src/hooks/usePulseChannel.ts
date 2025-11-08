import { useEffect, useMemo, useRef, useState } from "react";
import { rtdb, auth } from "@/integrations/firebase";

export type PulsePayload = {
  color?: string;
  shape?: string;
  rhythmMs?: number;
  intensity?: 'soft' | 'normal' | 'strong';
};

export type PulseEvent = {
  type: "pulse";
  pairId: string;
  ts: number;
  payload: PulsePayload;
};

const CHANNEL_NAME = "pulsepod-realtime"; // for local fallback

export function usePulseChannel(pairId: string | null) {
  const [lastPulse, setLastPulse] = useState<PulseEvent | null>(null);
  const [history, setHistory] = useState<PulseEvent[]>([]);
  const [partnerOnline, setPartnerOnline] = useState<boolean>(false);
  const [partnerLastSeen, setPartnerLastSeen] = useState<number | null>(null);
  const [partnerUid, setPartnerUid] = useState<string | null>(null);
  const [receiptsMap, setReceiptsMap] = useState<Record<string, Record<string, number>>>({});
  const [partnerRealtimeActive, setPartnerRealtimeActive] = useState<boolean>(false);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const uidRef = useRef<string | null>(null);
  const encKeyRef = useRef<CryptoKey | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => { uidRef.current = u?.uid || null; });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!pairId) { encKeyRef.current = null; return; }
    try {
      const raw = localStorage.getItem(`pairKey:${pairId}`);
      if (!raw) { encKeyRef.current = null; return; }
      const keyBytes = b64ToBytes(raw);
      importRawAesKey(keyBytes).then(k => { encKeyRef.current = k; }).catch(()=>{ encKeyRef.current = null; });
    } catch { encKeyRef.current = null; }
  }, [pairId]);

  // Subscribe to Firebase RTDB if pairId
  useEffect(() => {
    if (!pairId) return;

    let unsubLocal: (() => void) | null = null;

    try {
      const pulseRef = rtdb.ref(`/pairs/${pairId}/pulse`);
      const pulseEncRef = rtdb.ref(`/pairs/${pairId}/pulseEnc`);
      const handler = (snap: any) => {
        const val = snap.val();
        if (!val) return;
        const evt: PulseEvent = {
          type: "pulse",
          pairId,
          ts: val.ts || Date.now(),
          payload: { color: val.color, shape: val.shape, rhythmMs: val.rhythmMs, intensity: val.intensity },
        };
        setLastPulse(evt);
        try {
          const dir = val.fromUid && uidRef.current && val.fromUid === uidRef.current ? "out" : "in";
          const entry = { ...evt } as PulseEvent & { dir?: "in" | "out" };
          (entry as any).dir = dir;
          const histRoot = rtdb.ref(`/pairs/${pairId}/history`);
          const histRef = histRoot.push();
          histRef
            .set({ ts: evt.ts, color: val.color, shape: val.shape, rhythmMs: val.rhythmMs, intensity: val.intensity, fromUid: val.fromUid })
            .then(() => {
              histRoot.once("value", (snap: any) => {
                try {
                  const data = snap.val() || {};
                  const entries = Object.entries<any>(data).sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0));
                  const excess = entries.length - 100;
                  if (excess > 0) {
                    const toDelete = entries.slice(0, excess).map(([key]) => key);
                    toDelete.forEach((k) => histRoot.child(k).remove().catch(() => {}));
                  }
                } catch {}
              });
            })
            .catch(() => {});
          // Write read receipt when we receive an incoming pulse
          try {
            if (dir === 'in') {
              const me = uidRef.current;
              if (me) {
                rtdb.ref(`/pairs/${pairId}/receipts/${evt.ts}/${me}`).set(Date.now()).catch(() => {});
              }
            }
          } catch {}
        } catch {}
        // Update streak using UTC boundaries. Break after a missed day (start back at 1).
        try {
          const now = new Date();
          const utcYMD = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}-${String(now.getUTCDate()).padStart(2,'0')}`;
          const y = now.getUTCFullYear();
          const m = now.getUTCMonth();
          const d = now.getUTCDate();
          const yesterday = new Date(Date.UTC(y, m, d - 1));
          const utcYMDYesterday = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth()+1).padStart(2,'0')}-${String(yesterday.getUTCDate()).padStart(2,'0')}`;
          const streakRef = rtdb.ref(`/pairs/${pairId}/streak`);
          streakRef.transaction((curr: any) => {
            const last = curr?.lastDate || null;
            const count = typeof curr?.count === 'number' ? curr.count : 0;
            if (last === utcYMD) {
              return curr || { count: 1, lastDate: utcYMD };
            }
            if (last === utcYMDYesterday) {
              return { count: count + 1, lastDate: utcYMD };
            }
            // Missed a day (or first ever): reset streak and start at 1 today
            return { count: 1, lastDate: utcYMD };
          });
        } catch {}
      };
      pulseRef.on("value", handler);
      // Encrypted channel
      const encHandler = async (snap: any) => {
        const val = snap.val(); if (!val) return;
        const key = encKeyRef.current; if (!key) return;
        try {
          const ts = val.ts || Date.now();
          const iv = b64ToBytes(val.iv);
          const ct = b64ToBytes(val.ct);
          const plain = await decryptAesGcmJSON(key, iv, ct);
          const evt: PulseEvent = { type: 'pulse', pairId, ts, payload: plain };
          setLastPulse(evt);
          // Receipt for incoming
          try {
            const dir = (val.fromUid && uidRef.current && val.fromUid === uidRef.current) ? 'out' : 'in';
            if (dir === 'in') {
              const me = uidRef.current; if (me) rtdb.ref(`/pairs/${pairId}/receipts/${ts}/${me}`).set(Date.now()).catch(()=>{});
            }
          } catch {}
        } catch {}
      };
      pulseEncRef.on('value', encHandler);
      unsubLocal = () => { pulseRef.off("value", handler); pulseEncRef.off('value', encHandler); };
      return () => {
        unsubLocal && unsubLocal();
      };
    } catch (e) {
      // Fallback to BroadcastChannel if Firebase not available
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bcRef.current = bc;
      const onMessage = (ev: MessageEvent) => {
        const data = ev.data as PulseEvent;
        if (!data || data.type !== "pulse") return;
        if (data.pairId !== pairId) return;
        setLastPulse(data);
      };
      bc.addEventListener("message", onMessage);
      return () => {
        bc.removeEventListener("message", onMessage);
        bc.close();
        bcRef.current = null;
      };
    }
  }, [pairId]);

  useEffect(() => {
    if (!pairId) return;
    const q = rtdb.ref(`/pairs/${pairId}/history`).limitToLast(10);
    const handler = (snap: any) => {
      const val = snap.val() || {};
      const items: PulseEvent[] = Object.keys(val)
        .map((k) => ({ type: "pulse" as const, pairId, ts: val[k].ts, payload: { color: val[k].color, shape: val[k].shape, rhythmMs: val[k].rhythmMs, intensity: val[k].intensity } }))
        .sort((a, b) => a.ts - b.ts);
      setHistory(items);
    };
    q.on("value", handler);
    // Also subscribe to recent receipts
    const r = rtdb.ref(`/pairs/${pairId}/receipts`).limitToLast(20);
    const rh = (snap: any) => {
      const val = snap.val() || {};
      setReceiptsMap(val);
    };
    r.on('value', rh);
    return () => { q.off("value", handler); r.off('value', rh); };
  }, [pairId]);

  useEffect(() => {
    if (!pairId) return;
    const me = () => uidRef.current;
    const presMeRef = rtdb.ref(`/pairs/${pairId}/presence`);
    const infoRef = rtdb.ref("/.info/connected");
    let heartbeat: any;
    infoRef.on("value", (snap: any) => {
      if (!snap.val()) return;
      const uid = me();
      if (!uid) return;
      const myRef = presMeRef.child(uid);
      myRef.onDisconnect().update({ state: "offline", lastSeen: Date.now() }).catch(() => {});
      myRef.update({ state: "online", lastSeen: Date.now() }).catch(() => {});
      // Heartbeat to keep lastSeen fresh while online
      if (heartbeat) clearInterval(heartbeat);
      heartbeat = setInterval(() => {
        myRef.update({ lastSeen: Date.now() }).catch(() => {});
      }, 20000);
    });
    const othersRef = rtdb.ref(`/pairs/${pairId}/presence`);
    const handler = (snap: any) => {
      const uid = me();
      const val = snap.val() || {};
      const keys = Object.keys(val).filter(k => k !== uid);
      if (keys.length) {
        const p = val[keys[0]];
        setPartnerOnline(p?.state === "online");
        setPartnerLastSeen(p?.lastSeen || null);
        setPartnerUid(keys[0] || null);
      } else {
        setPartnerOnline(false);
        setPartnerLastSeen(null);
        setPartnerUid(null);
      }
    };
    othersRef.on("value", handler);
    // Subscribe to partner activity pings (short-window real-time)
    const actRef = rtdb.ref(`/pairs/${pairId}/activity`);
    const actHandler = (snap: any) => {
      const uid = me();
      const val = snap.val() || {};
      const keys = Object.keys(val).filter((k) => k !== uid);
      const ts = keys.length ? val[keys[0]] : null;
      setPartnerRealtimeActive(!!ts && Date.now() - ts < 7000);
    };
    actRef.on('value', actHandler);
    return () => {
      infoRef.off();
      othersRef.off("value", handler);
      actRef.off('value', actHandler);
      if (heartbeat) clearInterval(heartbeat);
    };
  }, [pairId]);

  const sendPulse = useMemo(
    () =>
      async (payload: PulsePayload = {}) => {
        if (!pairId) return;
        const evt: PulseEvent = {
          type: "pulse",
          pairId,
          ts: Date.now(),
          payload,
        };
        try {
          const fromUid = uidRef.current;
          const key = encKeyRef.current;
          if (key) {
            const { iv, ct } = await encryptAesGcmJSON(key, evt.payload);
            await rtdb.ref(`/pairs/${pairId}`).update({
              'pulseEnc': { ts: evt.ts, iv: bytesToB64(iv), ct: bytesToB64(ct), fromUid },
              'meta/lastPulseTs': evt.ts,
              'meta/lastFrom': fromUid || null,
            });
          } else {
            await rtdb.ref(`/pairs/${pairId}`).update({
              'pulse': { ...evt.payload, ts: evt.ts, fromUid },
              'meta/lastPulseTs': evt.ts,
              'meta/lastFrom': fromUid || null,
            });
          }
          try { localStorage.setItem('lastSentTs', String(evt.ts)); } catch {}
          // Anonymous global heat bucket (best-effort)
          try {
            const bucket = await getGeoBucket();
            if (bucket) {
              const day = new Date();
              const ymd = `${day.getFullYear()}${String(day.getMonth()+1).padStart(2,'0')}${String(day.getDate()).padStart(2,'0')}`;
              const base = rtdb.ref(`/globalHeat/${ymd}/${bucket}`);
              base.child('count').transaction((c:any)=> (typeof c==='number'? c+1 : 1));
              base.child('lastTs').set(evt.ts).catch(()=>{});
              // Live stream event (color optional)
              try {
                const liveRef = rtdb.ref(`/globalLive`);
                await liveRef.push({ b: bucket, ts: evt.ts, c: evt.payload?.color || null });
              } catch {}
              // Increment global public counter (best-effort)
              try {
                rtdb.ref('/stats/totalPulses').transaction((c:any)=> (typeof c==='number' ? c+1 : 1));
              } catch {}
            }
          } catch {}
          // Always increment daily public counter regardless of geolocation
          try {
            const day = new Date();
            const ymd = `${day.getFullYear()}${String(day.getMonth()+1).padStart(2,'0')}${String(day.getDate()).padStart(2,'0')}`;
            rtdb.ref(`/stats/daily/${ymd}`).transaction((c:any)=> (typeof c==='number' ? c+1 : 1));
          } catch {}
          // mark activity ping immediately
          if (fromUid) {
            rtdb.ref(`/pairs/${pairId}/activity/${fromUid}`).set(Date.now()).catch(() => {});
          }
          try {
            if (!localStorage.getItem('firstPulseLogged')) {
              (window as any).plausible?.('First Pulse Sent');
              localStorage.setItem('firstPulseLogged', '1');
            }
          } catch {}
        } catch (e) {
          // Fallback to local broadcast
          try {
            bcRef.current?.postMessage(evt);
          } catch {}
        }
        setLastPulse(evt);
      },
    [pairId]
  );

  const partnerActive = useMemo(() => {
    if (!partnerLastSeen) return false;
    return Date.now() - partnerLastSeen < 30000; // active within 30s
  }, [partnerLastSeen]);

  return { sendPulse, lastPulse, history, partnerOnline, partnerLastSeen, partnerActive, partnerUid, receiptsMap, partnerRealtimeActive };
}

async function importRawAesKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  const buf = toCryptoBuffer(keyBytes);
  return crypto.subtle.importKey('raw', buf, { name: 'AES-GCM' }, false, ['encrypt','decrypt']);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function bytesToB64(bytes: Uint8Array): string {
  let s = '';
  for (let i=0;i<bytes.length;i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

async function encryptAesGcmJSON(key: CryptoKey, obj: any): Promise<{iv: Uint8Array; ct: Uint8Array}> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(obj || {}));
  const ctBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: toCryptoBuffer(iv) }, key, toCryptoBuffer(data));
  return { iv, ct: new Uint8Array(ctBuf) };
}

async function decryptAesGcmJSON(key: CryptoKey, iv: Uint8Array, ct: Uint8Array): Promise<any> {
  const ptBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: toCryptoBuffer(iv) }, key, toCryptoBuffer(ct));
  const txt = new TextDecoder().decode(ptBuf);
  return JSON.parse(txt);
}

function toCryptoBuffer(u8: Uint8Array): ArrayBuffer {
  // Copy into a new ArrayBuffer to avoid ArrayBufferLike/SharedArrayBuffer typing issues
  const buf = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buf).set(u8);
  return buf;
}

async function getGeoBucket(): Promise<string | null> {
  try {
    const cached = localStorage.getItem('geoHeat');
    if (cached) return cached;
  } catch {}
  if (!('geolocation' in navigator)) return null;
  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          // Quantize ~0.5° to keep it anonymous (~55km)
          const q = (v:number)=> Math.round(v*2)/2;
          const b = `${q(lat).toFixed(1)},${q(lon).toFixed(1)}`;
          try { localStorage.setItem('geoHeat', b); } catch {}
          resolve(b);
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 2500, maximumAge: 86400000 }
      );
    } catch { resolve(null); }
  });
}
