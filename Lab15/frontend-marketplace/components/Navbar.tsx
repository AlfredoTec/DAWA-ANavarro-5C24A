"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white border-b-4 border-[#C7F33C]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-[#C7F33C]">Market</span>place
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-[#C7F33C] transition-colors font-medium">
            Inicio
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-[#C7F33C] transition-colors font-medium">
                  Admin
                </Link>
              )}
              <span className="text-[#E1F2AE] text-sm">{user.nombre}</span>
              <button
                onClick={logout}
                className="bg-[#C7F33C] text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-[#E1F2AE] transition-colors text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#C7F33C] text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-[#E1F2AE] transition-colors text-sm"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
