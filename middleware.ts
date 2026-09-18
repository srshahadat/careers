import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  const isAuthed = Boolean(sessionCookie) && sessionCookie === sessionSecret;

  if (!isAuthed) {
    // Protect the dashboard page
    if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Protect the admin data APIs (login route itself must stay open)
    if (
      req.nextUrl.pathname.startsWith("/api/admin") &&
      req.nextUrl.pathname !== "/api/admin/login"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
