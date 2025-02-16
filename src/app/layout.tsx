

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Everest Astro",
  description: "Your go-to place for astrology readings and consultations",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${process.env.NODE_ENV == "development" ? "debug-screens" : ""}`}>
        <Toaster position="bottom-left" />
        {children}
       </body>
    </html>
  );
}
