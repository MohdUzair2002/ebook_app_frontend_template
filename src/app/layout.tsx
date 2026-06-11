import type { Metadata } from "next";
import { Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KitabGhar",
  description: "A premium digital bookstore and learning environment.",
  openGraph: {
    title: "KitabGhar",
    description: "A premium digital bookstore and learning environment.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hanken.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
