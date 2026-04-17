import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "N·Walks — Walk on Earth Lightly",
  description:
    "Sustainable footwear made from naturally sourced wool, tree fibre, and sugarcane. Discover the most comfortable shoes you will ever wear.",
  keywords: "sustainable shoes, wool shoes, eco footwear, n-walks",
  openGraph: {
    title: "N·Walks",
    description: "Walk on Earth Lightly",
    url: "https://www.n-walks.com",
    siteName: "N·Walks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
