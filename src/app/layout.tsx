import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice of Talent",
  description: "Premium animated cinematic intro with seamless transitions",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen overflow-hidden`}
    >
      <head>
        <link rel="preconnect" href="https://media.career141.com" />
        <link rel="dns-prefetch" href="https://media.career141.com" />
        <link rel="preload" href="https://media.career141.com/WhatsApp%20Video%202026-05-19%20at%203.05.38%20PM.mp4" as="video" type="video/mp4" />
      </head>
      <body suppressHydrationWarning className="w-screen h-screen overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}
