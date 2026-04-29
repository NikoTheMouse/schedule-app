import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MouseTime",
  description: "Group availability scheduling — when is everyone free?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
