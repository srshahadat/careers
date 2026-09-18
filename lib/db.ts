import { sql } from "@vercel/postgres";

// Call this once (it's safe to call repeatedly — uses IF NOT EXISTS)
// to make sure the applications table exists.
export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      department TEXT NOT NULL,
      specialization TEXT,
      cover_letter TEXT,
      resume_url TEXT NOT NULL,
      resume_filename TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export type Application = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string | null;
  cover_letter: string | null;
  resume_url: string;
  resume_filename: string;
  status: "pending" | "shortlisted" | "interview" | "rejected" | "hired";
  created_at: string;
};
