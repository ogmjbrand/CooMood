import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CartPill from "@/components/layout/CartPill";
import SmoothScroll from "@/components/layout/SmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Analytics from "@/components/layout/Analytics";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://coomood.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CooMood — Fragrance and More.",
    template: "%s | CooMood",
  },
  description:
    "Luxury eau de parfum, cologne, body mist, and home fragrance. Build your own signature scent with the CooMood Custom Scent Builder.",
  keywords: [
    "luxury fragrance",
    "eau de parfum",
    "custom perfume",
    "home fragrance",
    "CooMood",
  ],
  openGraph: {
    title: "CooMood — Fragrance and More.",
    description:
      "Luxury fragrances designed to calm your mind, elevate your confidence, and leave a lasting impression.",
    url: siteUrl,
    siteName: "CooMood",
    images: [{ url: "/images/bottle-hero-marble.png", width: 1200, height: 1200 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CooMood — Fragrance and More.",
    description:
      "Luxury fragrances designed to calm your mind, elevate your confidence, and leave a lasting impression.",
    images: ["/images/bottle-hero-marble.png"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <LoadingScreen />
        <SmoothScroll />
        <div className="noise-overlay" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CartPill />
        <Analytics />
      </body>
    </html>
  );
}
