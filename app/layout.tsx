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
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>',
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
        className={`${fredoka.variable} font-sans antialiased`}
      >
        {children}
        <BackgroundMusic />
      </body>
    </html>
  );
}
