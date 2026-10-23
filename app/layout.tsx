import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SC-Board · Instant Board",
  description: "메모를 가볍게 붙여 두는 공유 보드",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
