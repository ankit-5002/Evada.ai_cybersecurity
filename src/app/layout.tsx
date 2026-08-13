import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-evada-sans",
});

export const metadata: Metadata = {
  title: "EVADA - AI-Supported Pentest Platform",
  description: "AI-supported pentest and continuous risk validation platform",
  icons: {
    icon: "/logos/title.png",
    shortcut: "/logos/title.png",
    apple: "/logos/title.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
