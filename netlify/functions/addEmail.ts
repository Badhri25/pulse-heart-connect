import type { Handler } from "@netlify/functions";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

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
    const name = typeof rawName === "string" ? rawName.trim() : null;

    if (!isValidEmail(email)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid email" }) };
    }

    const client = await pool.connect();
    try {
      // Ensure table exists
      await client.query(
        `CREATE TABLE IF NOT EXISTS waitlist (
          id BIGSERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`
      );

      // Insert or ignore duplicates
      await client.query(
        `INSERT INTO waitlist (email, name)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING`,
        [email, name]
      );
    } finally {
      client.release();
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err?.message || "Server error" }) };
  }
};
