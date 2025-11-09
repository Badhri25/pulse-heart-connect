import type { Handler } from "@netlify/functions";
import { Pool } from "pg";
import { Resend } from "resend";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const resend = new Resend(process.env.RESEND_API_KEY || "");

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email) && email.length >= 5 && email.length <= 255;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
    }

    if (!process.env.DATABASE_URL) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "DATABASE_URL not set" }) };
    }

    const payload = JSON.parse(event.body || "{}");
    const rawEmail: unknown = payload.email;
    const rawName: unknown = payload.name;

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : "Anonymous";

    if (!isValidEmail(email)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid email" }) };
    }

    const client = await pool.connect();
    try {
      // ✅ Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS waitlist (
          id BIGSERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);

      // ✅ Insert or ignore duplicates
      await client.query(
        `INSERT INTO waitlist (email, name)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING`,
        [email, name]
      );
    } finally {
      client.release();
    }

    // ✅ Send thank-you email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "❤️ Thanks for being an early PulsePod user",
        html: `
          <div style="font-family:Inter, sans-serif; line-height:1.6; color:#0f172a;">
            <h2>Hi ${name},</h2>
            <p>Thank you so much for signing up for <b>PulsePod</b> — you’re one of the very first users to try it out!</p>
            <p>This little app was built to help people feel closer with a single tap — no words, just presence.</p>
            <p>Your early support truly keeps me motivated to improve it further ❤️</p>
            <p>I'd love to hear what you think — any feedback or thoughts are super valuable at this stage.</p>
            <p>With gratitude,<br><b>Badhri Srinivasan</b></p>
          </div>
        `,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("addEmail error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err?.message || "Server error" }),
    };
  }
};
