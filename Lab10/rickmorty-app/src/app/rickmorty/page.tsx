/**
 * SSG: Los datos se obtienen con cache: 'force-cache', lo que indica a Next.js
 * que almacene la respuesta de la API indefinidamente (hasta el próximo build).
 * Esto hace que el contenido se sirva de caché como en SSG clásico, sin
 * re-fetch por cada request. La paginación usa searchParams que hace la ruta
 * dinámica, pero el fetch sigue beneficiándose del caché de datos.
 */

import { Suspense } from "react";
import { ApiResponse } from "@/types/rickmorty";
import CharacterCard from "./_components/CharacterCard";
import PageJumper from "./_components/PageJumper";
import { GiPortal } from "react-icons/gi";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function getCharacters(page: number): Promise<ApiResponse> {
  // cache: 'force-cache' → SSG: la respuesta queda almacenada en el Data Cache
  // de Next.js y no se re-fetcha en cada request.
  const res = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}`,
    { cache: "force-cache" }
  );
  if (!res.ok) throw new Error("Error al obtener personajes");
  return res.json();
}

function CharacterGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-[#1e3a5f] bg-[#0f1828] animate-pulse">
          <div className="aspect-square bg-[#162035]" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-[#162035] rounded w-3/4" />
            <div className="h-3 bg-[#162035] rounded w-1/2" />
            <div className="h-3 bg-[#162035] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function CharacterGrid({ page }: { page: number }) {
  const data = await getCharacters(page);

  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[#8896b0] text-sm">
          Mostrando página{" "}
          <span className="text-[#39ff14] font-semibold">{page}</span> de{" "}
          <span className="text-white font-semibold">{data.info.pages}</span>{" "}
          ·{" "}
          <span className="text-[#00d4ff]">{data.info.count} personajes</span>{" "}
          en total
        </p>
        <span className="text-xs text-[#8896b0] bg-[#0f1828] border border-[#1e3a5f] px-3 py-1 rounded-full">
          SSG · force-cache
        </span>
      </div>

      {/* Grid - Lazy Loading: imágenes se cargan con loading="lazy" en CharacterCard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {data.results.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>

      {/* Pagination */}
      <Suspense>
        <PageJumper currentPage={page} totalPages={data.info.pages} />
      </Suspense>
    </>
  );
}

export default async function RickMortyPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <GiPortal className="text-3xl text-[#39ff14]" />
          <h1
            className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Personajes
          </h1>
        </div>
        <p className="text-[#8896b0] text-sm max-w-xl">
          Lista completa del multiverso. Las imágenes usan{" "}
          <span className="text-[#39ff14]">Lazy Loading</span> y los datos se
          sirven desde caché (SSG).
        </p>
      </div>

      <Suspense fallback={<CharacterGridSkeleton />}>
        <CharacterGrid page={page} />
      </Suspense>
    </div>
  );
}
