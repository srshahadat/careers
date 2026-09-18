import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Careers — Join Our Team",
  description: "Explore open positions and apply online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
