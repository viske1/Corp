import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clément Fradet — Product Designer & Design Engineer",
  description:
    "Product designer et design engineer : je conçois des interfaces métier complexes, de la réflexion au code en production. Disponible en full remote.",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
