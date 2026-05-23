import Link from "next/link";
import { FiHome, FiSearch, FiList } from "react-icons/fi";
import { GiPortal } from "react-icons/gi";

export default function RickMortyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050a12] flex flex-col">
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 border-b border-[#1e3a5f]"
        style={{ background: "rgba(5,10,18,0.95)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/rickmorty" className="flex items-center gap-3 group">
              <div className="relative">
                <GiPortal className="text-3xl text-[#39ff14] group-hover:text-[#55ff40] transition-colors" />
                <div className="absolute inset-0 blur-md bg-[#39ff14]/30 rounded-full group-hover:bg-[#39ff14]/50 transition-colors" />
              </div>
              <div>
                <span
                  className="text-lg font-black tracking-wider text-[#39ff14]"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  Rick<span className="text-white">&</span>Morty
                </span>
                <div className="text-[10px] text-[#8896b0] tracking-[0.3em] uppercase -mt-1">
                  Universe
                </div>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-[#8896b0] hover:text-[#39ff14] rounded-lg hover:bg-[#39ff14]/5 transition-all text-sm font-medium"
              >
                <FiHome className="text-base" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <Link
                href="/rickmorty"
                className="flex items-center gap-2 px-4 py-2 text-[#8896b0] hover:text-[#39ff14] rounded-lg hover:bg-[#39ff14]/5 transition-all text-sm font-medium"
              >
                <FiList className="text-base" />
                <span className="hidden sm:inline">Personajes</span>
              </Link>
              <Link
                href="/rickmorty/search"
                className="flex items-center gap-2 px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded-lg hover:bg-[#39ff14]/20 transition-all text-sm font-medium"
              >
                <FiSearch className="text-base" />
                <span className="hidden sm:inline">Buscar</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#1e3a5f] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#8896b0] text-sm">
            Powered by{" "}
            <a
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#39ff14] hover:underline"
            >
              Rick and Morty API
            </a>{" "}
            · Construido con Next.js 16 + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
