import { ReactNode } from "react";
import { Metadata } from "next";
import { GiPortal } from "react-icons/gi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rick and Morty - Universo de Personajes",
  description: "Explora todos los personajes del multiverso de Rick and Morty",
};

interface RickmortyLayoutProps {
  children: ReactNode;
}

export default function RickmortyLayout({ children }: RickmortyLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900">
      {/* Navbar sticky con efecto glass */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/rickmorty"
            className="flex items-center gap-2 text-green-400 text-2xl font-bold hover:text-green-300 transition"
          >
            <GiPortal size={32} className="animate-pulse" />
            Rick & Morty
          </Link>

          <div className="flex gap-6">
            <Link
              href="/rickmorty"
              className="text-gray-300 hover:text-green-400 transition font-medium"
            >
              Personajes
            </Link>
            <Link
              href="/rickmorty/search"
              className="text-gray-300 hover:text-green-400 transition font-medium"
            >
              Buscar
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}