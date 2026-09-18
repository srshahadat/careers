import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Keep this in sync with app/page.tsx DEPARTMENTS
const DEPARTMENTS_REQUIRING_SPECIALIZATION = ["Developer"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Honeypot check — if this hidden field is filled, it's almost certainly a bot.
    const honeypot = formData.get("website");
    if (honeypot) {
      // Pretend success so bots don't learn anything, but don't save the data.
      return NextResponse.json({ ok: true });
    }

    const full_name = (formData.get("full_name") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();
    const phone = (formData.get("phone") as string || "").trim();
    const department = (formData.get("department") as string || "").trim();
    const specialization = (formData.get("specialization") as string || "").trim();
    const cover_letter = (formData.get("cover_letter") as string || "").trim();
    const resume = formData.get("resume") as File | null;

    if (!full_name || !email || !phone || !department || !resume) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (DEPARTMENTS_REQUIRING_SPECIALIZATION.includes(department) && !specialization) {
      return NextResponse.json(
        { error: "Please select your specialization / tech stack." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document." },
        { status: 400 }
      );
    }

    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file must be under 5MB." },
        { status: 400 }
      );
    }

    await ensureSchema();

    // Duplicate application check — same email applying to the same department.
    const existing = await sql`
      SELECT id FROM applications WHERE email = ${email} AND department = ${department}
    `;
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { error: "You've already applied to this department with this email." },
        { status: 409 }
      );
    }

    // Sanitize filename and upload to Vercel Blob
    const safeName = resume.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const blob = await put(
      `resumes/${Date.now()}-${safeName}`,
      resume,
      { access: "public" }
    );

    await sql`
      INSERT INTO applications
        (full_name, email, phone, department, specialization, cover_letter, resume_url, resume_filename, status)
      VALUES
        (${full_name}, ${email}, ${phone}, ${department}, ${specialization || null}, ${cover_letter}, ${blob.url}, ${resume.name}, 'pending')
    `;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again in a moment." },
      { status: 500 }
    );
  }
}
