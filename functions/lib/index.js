"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPulseWrite = exports.sendWaitlistEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
// Initialize Admin SDK once
admin.apps.length ? admin.app() : admin.initializeApp();
// Helper to fetch device tokens for a pair, excluding a specific uid
async function getPairTokens(pairId, excludeUid) {
    const snap = await admin.database().ref(`/pairs/${pairId}/tokens`).get();
    const val = snap.val() || {};
    const tokens = [];
    Object.keys(val).forEach(uid => {
        if (excludeUid && uid === excludeUid)
            return;
        const t = val[uid]?.token;
        if (t)
            tokens.push(t);
    });
    return tokens;
}
// Welcome email for waitlist signups
exports.sendWaitlistEmail = functions.region('us-central1').https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS')
        return res.status(204).send('');
    if (req.method !== 'POST')
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    try {
        const email = (req.body?.email || '').toString().trim().toLowerCase();
        const valid = /.+@.+\..+/.test(email) && email.length >= 5 && email.length <= 255;
        if (!valid)
            return res.status(400).json({ ok: false, error: 'Invalid email' });
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            functions.logger.warn('RESEND_API_KEY not set; skipping email send');
            return res.status(200).json({ ok: true, sent: false });
        }
        const resend = new resend_1.Resend(apiKey);
        const from = process.env.RESEND_FROM || 'PulsePod <no-reply@pulsepod.app>';
        const subject = 'Welcome to PulsePod Early Access';
        const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 8px">You’re on the list 💗</h2>
        <p>Thanks for joining the PulsePod early access! We’ll reach out soon with next steps and your invite.</p>
        <p style="margin-top:16px;color:#64748b;font-size:14px">Presence, not pressure.</p>
      </div>
    `;
        await resend.emails.send({ from, to: email, subject, html });
        return res.status(200).json({ ok: true, sent: true });
    }
    catch (e) {
        functions.logger.error('sendWaitlistEmail error', e?.message || e);
        return res.status(500).json({ ok: false, error: 'Internal error' });
    }
});
exports.onPulseWrite = functions.database.ref('/pairs/{pairId}/pulse')
    .onWrite(async (change, context) => {
    const pairId = context.params.pairId;
    const after = change.after.exists() ? change.after.val() : null;
    if (!after)
        return;
    // Build a simple notification payload
    const color = after.color || '#FF5C8D';
    const shape = after.shape || 'pulse';
    const title = 'Pulse received';
    const body = `Shape: ${shape}${after.rhythmMs ? ` • ${after.rhythmMs}ms` : ''}`;
    const fromUid = after.fromUid;
    const tokens = await getPairTokens(pairId, fromUid);
    if (!tokens.length)
        return;
    try {
        const resp = await admin.messaging().sendEachForMulticast({
            tokens,
            notification: { title, body },
            data: {
                pairId,
                color: String(color),
                shape: String(shape),
                rhythmMs: after.rhythmMs ? String(after.rhythmMs) : ''
            },
            android: { priority: 'high' },
            webpush: {
                headers: { Urgency: 'high' },
                fcmOptions: { link: `/?pair=${encodeURIComponent(pairId)}` },
                notification: {
                    // Note: browser vibration ultimately decided client-side
                    vibrate: [100, 50, 100],
                }
            }
        });
        const failures = resp.responses.filter((r) => !r.success);
        if (failures.length)
            functions.logger.warn('FCM send failures', failures.map((f) => f.error?.message));
    }
    catch (e) {
        functions.logger.error('FCM send error', e?.message || e);
    }
});
