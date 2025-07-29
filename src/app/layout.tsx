import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deepgram Quickstarts Ecosystem",
  description: "Discover and deploy Deepgram starter applications. A unified ecosystem of modular, back-end-first starter apps with optional front-end components for rapidly building demos.",
  keywords: ["Deepgram", "AI", "Voice", "Speech", "API", "Starters", "Templates", "Quickstarts"],
  authors: [{ name: "Deepgram DX Team" }],
  openGraph: {
    title: "Deepgram Quickstarts Ecosystem",
    description: "Discover and deploy Deepgram starter applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
