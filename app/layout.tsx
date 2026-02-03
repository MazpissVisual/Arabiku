import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

import BackgroundMusic from "@/components/BackgroundMusic";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arabiku - Belajar Bahasa Arab Menyenangkan",
  description: "Platform e-learning Bahasa Arab interaktif untuk SD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} font-sans antialiased`}
      >
        {children}
        <BackgroundMusic />
      </body>
    </html>
  );
}
