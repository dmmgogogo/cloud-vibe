import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cloud-vibe",
  description: "Cursor Cloud Agents Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-black text-white font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
