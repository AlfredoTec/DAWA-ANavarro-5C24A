"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-black rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Iniciar Sesion</h1>
          <p className="text-center text-gray-600 mb-8">
            Ingresa a tu cuenta del Marketplace
          </p>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:border-[#C7F33C] transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Contrasena</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:border-[#C7F33C] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C7F33C] text-black font-bold py-3 rounded-xl hover:bg-[#E1F2AE] transition-colors disabled:opacity-50 border-2 border-black"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            No tienes cuenta?{" "}
            <Link href="/register" className="text-black font-semibold underline hover:text-[#C7F33C]">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
