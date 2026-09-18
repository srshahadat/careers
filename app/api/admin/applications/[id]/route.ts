import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { del } from "@vercel/blob";

const VALID_STATUSES = ["pending", "shortlisted", "interview", "rejected", "hired"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await sql`
      UPDATE applications SET status = ${status} WHERE id = ${params.id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update status error:", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`
      SELECT resume_url FROM applications WHERE id = ${params.id}
    `;

    if (rows[0]?.resume_url) {
      await del(rows[0].resume_url).catch(() => {
        // Non-fatal if blob delete fails (e.g. already removed)
      });
    }

    await sql`DELETE FROM applications WHERE id = ${params.id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete application error:", err);
    return NextResponse.json({ error: "Failed to delete application." }, { status: 500 });
  }
}
