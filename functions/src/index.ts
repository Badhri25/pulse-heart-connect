import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';

// Initialize Admin SDK once
admin.apps.length ? admin.app() : admin.initializeApp();

// Helper to fetch device tokens for a pair, excluding a specific uid
async function getPairTokens(pairId: string, excludeUid?: string) {
  const snap = await admin.database().ref(`/pairs/${pairId}/tokens`).get();
  const val = (snap.val() || {}) as Record<string, { token: string } | undefined>;
  const tokens: string[] = [];
  Object.keys(val).forEach((uid) => {
    if (excludeUid && uid === excludeUid) return;
    const t = val[uid]?.token;
    if (t) tokens.push(t);
  });
  return tokens;
}

// ✅ Welcome email + waitlist storage for signups
export const sendWaitlistEmail = functions.region('us-central1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const email = (req.body?.email || '').toString().trim().toLowerCase();
    const valid = /.+@.+\..+/.test(email) && email.length >= 5 && email.length <= 255;
    if (!valid) return res.status(400).json({ ok: false, error: 'Invalid email' });

    // ✅ Save email to Realtime Database (with duplicate prevention)
    const db = admin.database();
    const existing = await db.ref('waitlist').orderByChild('email').equalTo(email).get();
    if (existing.exists()) {
      functions.logger.info(`Email already exists in waitlist: ${email}`);
    } else {
      await db.ref('waitlist').push({
        email,
        createdAt: admin.database.ServerValue.TIMESTAMP,
      });
      functions.logger.info(`Saved new waitlist email: ${email}`);
    }

    // ✅ Send welcome email using Resend (if configured)
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      functions.logger.warn('RESEND_API_KEY not set; skipping email send');
      return res.status(200).json({ ok: true, saved: true, sent: false });
    }

    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || 'PulsePod <no-reply@pulsepod.app>';
    const subject = 'Welcome to PulsePod Early Access 💗';
    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 8px">You’re on the list 💗</h2>
        <p>Thanks for joining the PulsePod early access! We’ll reach out soon with next steps and your invite.</p>
        <p style="margin-top:16px;color:#64748b;font-size:14px">Presence, not pressure.</p>
      </div>
    `;

    await resend.emails.send({ from, to: email, subject, html });
    functions.logger.info(`Welcome email sent to ${email}`);

    return res.status(200).json({ ok: true, saved: true, sent: true });
  } catch (e: any) {
    functions.logger.error('sendWaitlistEmail error', e?.message || e);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// ✅ Push notification function (unchanged)
export const onPulseWrite = functions.database.ref('/pairs/{pairId}/pulse').onWrite(
  async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext) => {
    const pairId = context.params.pairId as string;
    const after = change.after.exists() ? (change.after.val() as any) : null;
    if (!after) return;

    // Build a simple notification payload
    const color = after.color || '#FF5C8D';
    const shape = after.shape || 'pulse';
    const title = 'Pulse received';
    const body = `Shape: ${shape}${after.rhythmMs ? ` • ${after.rhythmMs}ms` : ''}`;
    const fromUid = after.fromUid as string | undefined;

    const tokens = await getPairTokens(pairId, fromUid);
    if (!tokens.length) return;

    try {
      const resp = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: {
          pairId,
          color: String(color),
          shape: String(shape),
          rhythmMs: after.rhythmMs ? String(after.rhythmMs) : '',
        },
        android: { priority: 'high' },
        webpush: {
          headers: { Urgency: 'high' },
          fcmOptions: { link: `/?pair=${encodeURIComponent(pairId)}` },
          notification: {
            vibrate: [100, 50, 100] as any,
          },
        },
      });
      const failures = resp.responses.filter((r) => !r.success);
      if (failures.length)
        functions.logger.warn('FCM send failures', failures.map((f) => f.error?.message));
    } catch (e: any) {
      functions.logger.error('FCM send error', e?.message || e);
    }
  }
);
