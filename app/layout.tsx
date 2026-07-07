import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Angle — позы для фотографий",
  description: "Позы и идеи для фотосессий. Pinterest для фотографов без скачивания.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Angle",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#E8DDD2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const r2Origin = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  return (
    <html lang="ru" className={`${geistSans.variable} h-full`}>
      <head>
        {r2Origin ? <link rel="preconnect" href={r2Origin} /> : null}
        {r2Origin ? <link rel="dns-prefetch" href={r2Origin} /> : null}
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
