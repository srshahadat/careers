import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT * FROM applications ORDER BY created_at DESC
    `;
    return NextResponse.json({ applications: rows });
  } catch (err) {
    console.error("Fetch applications error:", err);
    return NextResponse.json(
      { error: "Failed to load applications." },
      { status: 500 }
    );
  }
}
