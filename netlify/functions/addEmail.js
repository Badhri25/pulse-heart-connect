// netlify/functions/addEmail.js
import { Client } from "pg";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name = null, email } = JSON.parse(event.body || "{}");
    if (!email || !/.+@.+\..+/.test(email)) {
      return { statusCode: 400, body: "Invalid email" };
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL, // auto from Netlify–Neon integration
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    // upsert: insert if new, ignore if duplicate email
    await client.query(
      `INSERT INTO waitlist (name, email) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [name, email.toLowerCase().trim()]
    );
    await client.end();

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("addEmail error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
}
