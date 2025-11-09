// netlify/functions/addEmail.js
import { Client } from "pg";

// Netlify will automatically provide DATABASE_URL from the Neon integration
export async function handler(event) {
  // 1️⃣ Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2️⃣ Parse the incoming request (expecting JSON { name, email })
    const { name, email } = JSON.parse(event.body || "{}");

    // 3️⃣ Basic validation
    if (!name || !email) {
      return { statusCode: 400, body: "Missing name or email" };
    }

    // 4️⃣ Connect to Neon (Postgres)
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // 5️⃣ Insert into your waitlist table
    await client.query(
      "INSERT INTO waitlist (name, email) VALUES ($1, $2)",
      [name, email]
    );

    await client.end();

    // 6️⃣ Respond success
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Added to waitlist!" }),
    };
  } catch (err) {
    console.error("❌ Error inserting:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
}
