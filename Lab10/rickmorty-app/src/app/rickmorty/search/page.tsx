"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Character, CharacterListResponse } from "@/types/rickmorty";
import { GiMagnifyingGlass } from "react-icons/gi";

// ----------------------------------------------------------------
// Constantes
// ----------------------------------------------------------------

const STATUS_OPTIONS = ["", "alive", "dead", "unknown"] as const;
const GENDER_OPTIONS = ["", "female", "male", "genderless", "unknown"] as const;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function statusColor(status: string): string {
  switch (status) {
    case "Alive":
      return "bg-green-600";
    case "Dead":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
}

// ----------------------------------------------------------------
// Componente principal (CSR)
// ----------------------------------------------------------------

export default function SearchPage() {
  // Razonamiento: estado local para filtros porque es CSR puro.
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Resultados y estado de carga.
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // ----------------------------------------------------------------
  // Fetch con debounce (300ms)
  // ----------------------------------------------------------------

  /**
   * @purpose Ejecuta la búsqueda contra la API con los filtros y página actual.
   *          Usa useCallback para estabilizar la referencia.
   */
  const searchCharacters = useCallback(
    async (page: number) => {
      // Razonamiento: si no hay ningún filtro, no buscamos.
      if (!name.trim() && !status && !type.trim() && !gender) {
        setResults([]);
        setSearched(false);
        setTotalPages(1);
        setTotalCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      setSearched(true);

      try {
        // Razonamiento: construimos query params dinámicamente según filtros activos.
        const params = new URLSearchParams();
        if (name.trim()) params.set("name", name.trim());
        if (status) params.set("status", status);
        if (type.trim()) params.set("type", type.trim());
        if (gender) params.set("gender", gender);
        params.set("page", String(page));

        const API = process.env.NEXT_PUBLIC_RICKMORTY_API;
        const res = await fetch(
          `${API}/character/?${params.toString()}`
        );

        if (!res.ok) {
          // Razonamiento: la API devuelve 404 cuando no hay resultados.
          if (res.status === 404) {
            setResults([]);
            setTotalPages(1);
            setTotalCount(0);
            return;
          }
          throw new Error("Error en la búsqueda");
        }

        const data: CharacterListResponse = await res.json();
        setResults(data.results);
        setTotalPages(data.info.pages);
        setTotalCount(data.info.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [name, status, type, gender]
  );

  // ----------------------------------------------------------------
  // Efecto: debounce de 300ms + reset a página 1 al cambiar filtros
  // ----------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCharacters(currentPage);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchCharacters, currentPage]);

  // ----------------------------------------------------------------
  // Navegación de página
  // ----------------------------------------------------------------

  const goToPage = (page: number) => {
    setCurrentPage(page);
    searchCharacters(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-green-400 drop-shadow-lg mb-4">
            <GiMagnifyingGlass size={48} className="inline-block mr-3" />
            Buscar Personajes (CSR)
          </h1>
          <p className="text-gray-400 text-lg">
            Búsqueda en tiempo real por nombre, estado, tipo y género
          </p>
        </div>

        {/* Panel de filtros */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-gray-700/50 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro: Nombre */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Rick..."
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500"
              />
            </div>

            {/* Filtro: Status */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt
                      ? opt.charAt(0).toUpperCase() + opt.slice(1)
                      : "Todos"}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro: Tipo */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Tipo
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ej: Parasite..."
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500"
              />
            </div>

            {/* Filtro: Género */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Género
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt
                      ? opt.charAt(0).toUpperCase() + opt.slice(1)
                      : "Todos"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estado: Cargando */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Buscando en el multiverso...</p>
            </div>
          </div>
        )}

        {/* Estado: Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Estado: Sin resultados */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">
              No se encontraron personajes con esos filtros.
            </p>
            <p className="text-gray-500 mt-2">Intenta con otros términos.</p>
          </div>
        )}

        {/* Estado: Sin búsqueda aún */}
        {!loading && !searched && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">
              Ingresa al menos un filtro para comenzar la búsqueda.
            </p>
          </div>
        )}

        {/* Resultados */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-gray-400 mb-6">
              {totalCount} resultado{totalCount !== 1 && "s"} encontrado
              {totalCount !== 1 && "s"}
              {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map((character) => (
                <Link
                  key={character.id}
                  href={`/rickmorty/${character.id}`}
                  className="group transform transition hover:scale-105 focus:scale-105"
                >
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 hover:shadow-2xl border border-gray-700/50 hover:border-green-500/50 transition-all">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={character.image}
                        alt={character.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        unoptimized
                      />
                    </div>

                    <div className="p-4">
                      <h2 className="text-white font-bold text-lg truncate group-hover:text-green-400 transition">
                        {character.name}
                      </h2>

                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`${statusColor(character.status)} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}
                        >
                          {character.status}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {character.species}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12">
                {prevPage ? (
                  <button
                    onClick={() => goToPage(prevPage)}
                    className="bg-gray-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition border border-gray-600 hover:border-green-500 cursor-pointer"
                  >
                    ← Anterior
                  </button>
                ) : (
                  <span className="bg-gray-800/50 text-gray-600 font-bold py-3 px-6 rounded-lg border border-gray-700/30 cursor-not-allowed">
                    ← Anterior
                  </span>
                )}

                <SearchPageJumper
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onJump={goToPage}
                />

                {nextPage ? (
                  <button
                    onClick={() => goToPage(nextPage)}
                    className="bg-gray-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition border border-gray-600 hover:border-green-500 cursor-pointer"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <span className="bg-gray-800/50 text-gray-600 font-bold py-3 px-6 rounded-lg border border-gray-700/30 cursor-not-allowed">
                    Siguiente →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// PageJumper específico para búsqueda (CSR, sin router)
// ----------------------------------------------------------------

function SearchPageJumper({
  totalPages,
  onJump,
}: {
  currentPage: number;
  totalPages: number;
  onJump: (page: number) => void;
}) {
  const [value, setValue] = useState("");

  const handleJump = () => {
    const page = Number(value);
    if (page >= 1 && page <= totalPages) {
      onJump(page);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleJump();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={totalPages}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`1-${totalPages}`}
        className="w-20 bg-gray-900 text-white text-center border border-gray-600 rounded-lg px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={handleJump}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg transition cursor-pointer"
      >
        Ir
      </button>
    </div>
  );
}