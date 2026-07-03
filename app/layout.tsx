import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060810",
};

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : undefined,
  title: "H4Graph — Ask your literature. Get cited answers.",
  description:
    "H4Graph turns thousands of papers into a knowledge graph your team can interrogate — and answers with citations, including the connections you didn't know were there.",
  openGraph: {
    title: "H4Graph — Ask your literature. Get cited answers.",
    description:
      "A hybrid 4-layer answering engine: vector, graph, relational, and agent — every claim cited.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${serif.variable} ${mono.variable} noise`}
      >
        <noscript>
          {/* Reveal serializes opacity:0 into SSR HTML; without JS nothing
              would ever fade in, so force it visible */}
          <style>{`.reveal-ssr{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
