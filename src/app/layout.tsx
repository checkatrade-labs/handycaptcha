import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181B", // Matches the zinc color scheme used in the site
};

export const metadata: Metadata = {
  title: "HandyCAPTCHA - Home Improvement CAPTCHA Service",
  description: "The first CAPTCHA service designed specifically for the home improvement industry. Verify users while showcasing your expertise.",
  keywords: [
    "CAPTCHA",
    "home improvement",
    "security",
    "verification",
    "plumbing",
    "construction",
    "electrical",
    "maintenance",
  ],
  openGraph: {
    title: "HandyCAPTCHA - Home Improvement CAPTCHA Service",
    description: "The first CAPTCHA service designed specifically for the home improvement industry.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "HandyCAPTCHA",
    description: "Secure your forms with home improvement challenges",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
