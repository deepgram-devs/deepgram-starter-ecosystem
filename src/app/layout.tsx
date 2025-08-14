import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const favorit = localFont({
  src: "../fonts/ABCFavorit-Bold.woff2",
  variable: "--font-favorit",
});

export const metadata: Metadata = {
  title: "Deepgram Starter Ecosystem",
  description: "Discover and deploy Deepgram starter applications. A unified ecosystem of modular, back-end-first starter apps with optional front-end components for rapidly building demos.",
  keywords: ["Deepgram", "AI", "Voice", "Speech", "API", "Starters", "Templates"],
  authors: [{ name: "Deepgram DX Team" }],
  openGraph: {
    title: "Deepgram Starter Ecosystem",
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
        className={`${inter.className} ${favorit.variable} antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
