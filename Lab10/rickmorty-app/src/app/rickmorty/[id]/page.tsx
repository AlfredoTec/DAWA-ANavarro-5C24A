/**
 * ISR (Incremental Static Regeneration):
 * - generateStaticParams() pre-genera las rutas de TODOS los personajes en build time.
 * - revalidate = 864000 (10 días): la página estática se revalida cada 10 días.
 *   Si llega un request después del vencimiento, Next.js sirve la versión stale
 *   y re-genera la página en background. La siguiente solicitud recibe la fresca.
 * - Esto combina la velocidad de SSG con la actualización periódica de datos.
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiMapPin, FiFilm, FiCalendar, FiUser, FiGlobe } from "react-icons/fi";
import { GiDna1, GiPortal } from "react-icons/gi";
import { Character, ApiResponse } from "@/types/rickmorty";

// ISR: Revalidar cada 10 días (10 * 24 * 60 * 60 = 864 000 segundos)
export const revalidate = 864000;

// Las rutas no pregeneradas se generan on-demand (ISR fallback)
export const dynamicParams = true;

// Genera rutas estáticas para todos los personajes en build time
export async function generateStaticParams() {
  try {
    const allIds: { id: string }[] = [];

    // Fetch primera página para conocer total de páginas
    const firstRes = await fetch("https://rickandmortyapi.com/api/character", {
      cache: "force-cache",
    });

    if (!firstRes.ok) return [];

    const contentType = firstRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return [];

    const firstData: ApiResponse = await firstRes.json();
    const totalPages = firstData.info.pages;

    firstData.results.forEach((c) => allIds.push({ id: String(c.id) }));

    // Fetch todas las páginas restantes en paralelo
    const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(`https://rickandmortyapi.com/api/character?page=${i + 2}`, {
        cache: "force-cache",
      }).then(async (r) => {
        const ct = r.headers.get("content-type") ?? "";
        if (!r.ok || !ct.includes("application/json")) return null;
        return r.json() as Promise<ApiResponse>;
      })
    );

    const pages = await Promise.all(pagePromises);
    pages.forEach((page) => {
      if (page) page.results.forEach((c) => allIds.push({ id: String(c.id) }));
    });

    return allIds;
  } catch {
    // Si la API no está disponible en build time, las rutas se generan on-demand
    return [];
  }
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 },
  });

  if (!res.ok) notFound();

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) notFound();

  return res.json();
}

function extractEpisodeNumber(url: string): string {
  return url.split("/").pop() ?? url;
}

const statusConfig = {
  Alive: { label: "Vivo", color: "#39ff14", bg: "rgba(57,255,20,0.1)", border: "rgba(57,255,20,0.4)" },
  Dead: { label: "Muerto", color: "#ff4444", bg: "rgba(255,68,68,0.1)", border: "rgba(255,68,68,0.4)" },
  unknown: { label: "Desconocido", color: "#888888", bg: "rgba(136,136,136,0.1)", border: "rgba(136,136,136,0.4)" },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const character = await getCharacter(id);

  const status = statusConfig[character.status] ?? statusConfig.unknown;
  const createdDate = new Date(character.created).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/rickmorty"
        className="inline-flex items-center gap-2 text-[#8896b0] hover:text-[#39ff14] transition-colors mb-8 group text-sm"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Volver a personajes
      </Link>

      {/* ISR badge */}
      <div className="mb-6">
        <span className="text-xs text-[#8896b0] bg-[#0f1828] border border-[#1e3a5f] px-3 py-1 rounded-full">
          ISR · revalidate: 10 días · generateStaticParams
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Image + basic info */}
        <div className="md:col-span-1 space-y-4">
          {/* Character image */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden border-2"
            style={{
              borderColor: status.color,
              boxShadow: `0 0 30px ${status.border}`,
            }}
          >
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              className="object-cover"
            />
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: status.bg,
              borderColor: status.border,
            }}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: status.color,
                boxShadow: `0 0 8px ${status.color}`,
              }}
            />
            <span className="font-semibold" style={{ color: status.color }}>
              {status.label}
            </span>
            <span className="text-[#8896b0] text-sm ml-auto">
              {character.status}
            </span>
          </div>

          {/* Quick info pills */}
          <div className="space-y-2">
            {[
              { icon: <FiUser />, label: "Género", value: character.gender },
              { icon: <GiDna1 />, label: "Especie", value: character.species },
              ...(character.type
                ? [{ icon: <GiPortal />, label: "Tipo", value: character.type }]
                : []),
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0f1828] border border-[#1e3a5f]"
              >
                <span className="text-[#39ff14]">{item.icon}</span>
                <div>
                  <div className="text-xs text-[#8896b0] leading-none mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-white text-sm font-medium">
                    {item.value || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Name + ID */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[#8896b0] text-sm font-mono">#{character.id}</span>
              <div className="h-px flex-1 bg-[#1e3a5f]" />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {character.name}
            </h1>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0f1828] border border-[#1e3a5f] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[#8896b0] text-xs uppercase tracking-wider mb-2">
                <FiGlobe className="text-[#00d4ff]" />
                Origen
              </div>
              <p className="text-white font-medium">{character.origin.name}</p>
              {character.origin.url && (
                <p className="text-[#8896b0] text-xs mt-1 font-mono truncate">
                  {character.origin.url.split("/api/")[1] || "—"}
                </p>
              )}
            </div>
            <div className="bg-[#0f1828] border border-[#1e3a5f] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[#8896b0] text-xs uppercase tracking-wider mb-2">
                <FiMapPin className="text-[#39ff14]" />
                Última ubicación
              </div>
              <p className="text-white font-medium">{character.location.name}</p>
              {character.location.url && (
                <p className="text-[#8896b0] text-xs mt-1 font-mono truncate">
                  {character.location.url.split("/api/")[1] || "—"}
                </p>
              )}
            </div>
          </div>

          {/* Episodes */}
          <div className="bg-[#0f1828] border border-[#1e3a5f] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#8896b0] text-xs uppercase tracking-wider">
                <FiFilm className="text-[#00d4ff]" />
                Episodios
              </div>
              <span
                className="text-lg font-black text-[#39ff14]"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {character.episode.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {character.episode.map((ep) => {
                const epNum = extractEpisodeNumber(ep);
                return (
                  <span
                    key={ep}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/20 bg-[#00d4ff]/5"
                  >
                    EP {epNum.padStart(2, "0")}
                  </span>
                );
              })}
            </div>
            {character.episode.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1e3a5f] flex justify-between text-xs text-[#8896b0]">
                <span>
                  Primer ep:{" "}
                  <span className="text-white">
                    #{extractEpisodeNumber(character.episode[0])}
                  </span>
                </span>
                <span>
                  Último ep:{" "}
                  <span className="text-white">
                    #{extractEpisodeNumber(character.episode[character.episode.length - 1])}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-[#0f1828] border border-[#1e3a5f] rounded-xl p-5 space-y-3">
            <h3 className="text-[#8896b0] text-xs uppercase tracking-wider">
              Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-[#8896b0] flex-shrink-0" />
                <div>
                  <div className="text-xs text-[#8896b0]">Creado</div>
                  <div className="text-white text-sm">{createdDate}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8896b0] mb-1">URL de la API</div>
                <p className="text-[#8896b0] text-xs font-mono truncate">
                  {character.url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation between characters */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#1e3a5f]">
        {parseInt(id) > 1 ? (
          <Link
            href={`/rickmorty/${parseInt(id) - 1}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/40 transition-all text-sm"
          >
            <FiArrowLeft /> Personaje #{parseInt(id) - 1}
          </Link>
        ) : (
          <div />
        )}
        <Link
          href="/rickmorty"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14]/10 transition-all text-sm"
        >
          <GiPortal /> Ver todos
        </Link>
        <Link
          href={`/rickmorty/${parseInt(id) + 1}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/40 transition-all text-sm"
        >
          Personaje #{parseInt(id) + 1} <FiArrowLeft className="rotate-180" />
        </Link>
      </div>
    </div>
  );
}
