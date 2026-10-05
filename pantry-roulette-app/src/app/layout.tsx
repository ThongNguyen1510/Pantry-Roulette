import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pantry Roulette — Spin Your Next Meal",
  description:
    "Spin the 4-reel slot machine with ingredients you already own and get an instant AI-generated recipe. Reduce food waste, skip recipe scrolling, and make cooking fun!",
  keywords: [
    "cooking",
    "recipe generator",
    "pantry",
    "meal planning",
    "AI chef",
    "food waste",
  ],
  openGraph: {
    title: "Pantry Roulette — Spin Your Next Meal",
    description:
      "A gamified cooking app that randomly selects ingredients and generates instant recipes with AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
