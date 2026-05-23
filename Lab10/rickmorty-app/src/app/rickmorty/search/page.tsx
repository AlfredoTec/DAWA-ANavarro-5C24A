"use client";

/**
 * CSR (Client Side Rendering): Esta página usa 'use client' con useState y
 * useEffect para hacer búsquedas en tiempo real. El fetch ocurre en el
 * navegador cuando el usuario escribe, permitiendo interactividad inmediata
 * sin recargar la página.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX, FiLoader, FiUser } from "react-icons/fi";
import { GiPortal } from "react-icons/gi";
import { Character } from "@/types/rickmorty";

const statusOptions = [
  { value: "", label: "Todos los estados" },
  { value: "alive", label: "Vivo" },
  { value: "dead", label: "Muerto" },
  { value: "unknown", label: "Desconocido" },
];

const genderOptions = [
  { value: "", label: "Todos los géneros" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "genderless", label: "Sin género" },
  { value: "unknown", label: "Desconocido" },
];

const statusColors: Record<string, string> = {
  Alive: "#39ff14",
  Dead: "#ff4444",
  unknown: "#888888",
};

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Búsqueda en tiempo real con debounce de 400ms
  useEffect(() => {
    const hasFilters = name.trim() || status || type.trim() || gender;
    if (!hasFilters) {
      setCharacters([]);
      setSearched(false);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      setSearched(true);

      try {
        const params = new URLSearchParams();
        if (name.trim()) params.set("name", name.trim());
        if (status) params.set("status", status);
        if (type.trim()) params.set("type", type.trim());
        if (gender) params.set("gender", gender);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${params.toString()}`
        );

        if (res.status === 404) {
          setCharacters([]);
          setTotalCount(0);
          setError("No se encontraron personajes con esos filtros.");
          return;
        }

        if (!res.ok) {
          setError("Error al buscar personajes. Intenta de nuevo.");
          return;
        }

        const data = await res.json();
        setCharacters(data.results);
        setTotalCount(data.info.count);
      } catch {
        setError("Error de conexión. Verifica tu internet.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [name, status, type, gender]);

  function clearFilters() {
    setName("");
    setStatus("");
    setType("");
    setGender("");
  }

  const hasFilters = name.trim() || status || type.trim() || gender;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FiSearch className="text-3xl text-[#39ff14]" />
          <h1
            className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Buscar
          </h1>
          <span className="text-xs text-[#8896b0] bg-[#0f1828] border border-[#1e3a5f] px-3 py-1 rounded-full ml-auto">
            CSR · useEffect
          </span>
        </div>
        <p className="text-[#8896b0] text-sm">
          Búsqueda en tiempo real. Los resultados se actualizan mientras escribes.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#0f1828] border border-[#1e3a5f] rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#8896b0] uppercase tracking-wider mb-2">
              Nombre
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8896b0]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Rick, Morty..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#0a1020] border border-[#1e3a5f] rounded-xl text-white placeholder-[#8896b0]/50 focus:border-[#39ff14] focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#8896b0] uppercase tracking-wider mb-2">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a1020] border border-[#1e3a5f] rounded-xl text-white focus:border-[#39ff14] focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-[#8896b0] uppercase tracking-wider mb-2">
              Tipo
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ej: Parasite, Robot..."
              className="w-full px-4 py-2.5 bg-[#0a1020] border border-[#1e3a5f] rounded-xl text-white placeholder-[#8896b0]/50 focus:border-[#39ff14] focus:outline-none transition-colors text-sm"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-[#8896b0] uppercase tracking-wider mb-2">
              Género
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a1020] border border-[#1e3a5f] rounded-xl text-white focus:border-[#39ff14] focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-[#8896b0] hover:text-[#ff4444] border border-[#1e3a5f] hover:border-[#ff4444]/50 rounded-xl text-sm transition-all"
            >
              <FiX /> Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <GiPortal className="text-5xl text-[#39ff14] animate-spin" />
          <p className="text-[#8896b0]">Abriendo portal interdimensional...</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <GiPortal className="text-5xl text-[#8896b0] mx-auto mb-4 opacity-40" />
          <p className="text-[#8896b0] text-lg">{error}</p>
          <p className="text-[#8896b0]/50 text-sm mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {!loading && !error && searched && characters.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-[#8896b0] text-sm">
              Se encontraron{" "}
              <span className="text-[#39ff14] font-semibold">{totalCount}</span>{" "}
              personajes
            </p>
            {totalCount > 20 && (
              <span className="text-xs text-[#8896b0]/60">
                (mostrando los primeros 20)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {characters.map((char) => (
              <Link
                key={char.id}
                href={`/rickmorty/${char.id}`}
                className="block group"
              >
                <article className="card-hover rounded-xl overflow-hidden border border-[#1e3a5f] bg-[#0f1828] h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1020]/80 via-transparent to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ background: "rgba(5,10,18,0.85)", border: `1px solid ${statusColors[char.status] ?? "#888"}` }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: statusColors[char.status] ?? "#888" }}
                        />
                        {char.status === "Alive" ? "Vivo" : char.status === "Dead" ? "Muerto" : "?"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3
                      className="text-white font-bold text-sm line-clamp-1 group-hover:text-[#39ff14] transition-colors"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {char.name}
                    </h3>
                    <p className="text-[#8896b0] text-xs mt-0.5">{char.species}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}

      {!loading && !error && !searched && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <GiPortal className="text-7xl text-[#39ff14]/20 portal-pulse" />
          <h2
            className="text-xl text-[#8896b0] font-semibold"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Busca un personaje
          </h2>
          <p className="text-[#8896b0]/60 max-w-sm text-sm">
            Usa los filtros de arriba. Los resultados aparecen en tiempo real
            mientras escribes.
          </p>
        </div>
      )}
    </div>
  );
}
