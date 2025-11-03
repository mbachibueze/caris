import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  style: ["normal", "italic"],
  // fallback: ["system-ui", "sans-serif"],
  preload: true,
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "CareTrack – Remote Vaccination & Child Health Management",
  description:
    "CareTrack helps parents and doctors keep children’s vaccinations on track with real‑time tracking, reminders, and history. Monitor, schedule, and manage child health securely online.",
  keywords: [
    "CareTrack",
    "child health",
    "vaccination tracking",
    "vaccination schedule",
    "parent dashboard",
    "doctor dashboard",
    "child vaccination history",
    "healthcare app"
  ],
  authors: [
    {
      name: "CareTrack Team",
      url: "https://caretrack‑25.vercel.app"
    }
  ],
  openGraph: {
    title: "CareTrack – Remote Vaccination & Child Health Management",
    description:
      "CareTrack helps parents and doctors monitor, schedule, and track child vaccinations with ease. Real-time updates, history, reminders, and more.",
    siteName: "CareTrack",
    url: "https://caretrack-25.vercel.app",
    images: [
      {
        url: "https://caretrack-25.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareTrack – Monitor Child Vaccinations"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareTrack – Remote Vaccination & Child Health Management",
    description:
      "CareTrack helps parents and doctors monitor, schedule, and track child vaccinations with ease. Real-time updates, history, reminders, and more.",
    images: ["https://caretrack-25.vercel.app/og-image.png"],
  },
  metadataBase: new URL("https://caretrack-25.vercel.app"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.svg"
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
        className={cn(" antialised bg-[#ffffff] ", poppins.className, {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        {children}
      </body>
    </html>
  );
}
