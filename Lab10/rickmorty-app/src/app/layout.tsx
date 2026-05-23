import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rick & Morty Universe",
  description: "Explora todos los personajes del universo de Rick and Morty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${orbitron.variable} ${exo2.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-exo2), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
