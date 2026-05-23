import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Character, CharacterListResponse } from "@/types/rickmorty";
import { notFound } from "next/navigation";

// ----------------------------------------------------------------
// Tipos de props
// ----------------------------------------------------------------

interface CharacterDetailProps {
  params: Promise<{ id: string }>;
}

// ----------------------------------------------------------------
// Fetch del personaje por ID (ISR: revalidación cada 10 días)
// ----------------------------------------------------------------

/**
 * @purpose Obtiene un personaje por ID con ISR.
 *          revalidate: 864000 segundos = 10 días.
 */
async function getCharacter(id: string, retries = 2): Promise<Character> {
  const API = process.env.NEXT_PUBLIC_RICKMORTY_API;
  const res = await fetch(
    `${API}/character/${id}`,
    { next: { revalidate: 864000 } }
  );

  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500));
    return getCharacter(id, retries - 1);
  }

  // Razonamiento: notFound() para cualquier error evita que el build falle.
  // En runtime, Next.js muestra la página 404 gracefully.
  if (!res.ok) notFound();

  return res.json();
}

// ----------------------------------------------------------------
// generateStaticParams: pre-genera rutas para todos los IDs
// ----------------------------------------------------------------

/**
 * @purpose Genera en build time las rutas estáticas para todos los IDs.
 *          Se obtiene primero el total de personajes desde la API.
 */
export async function generateStaticParams() {
  // Razonamiento: obtenemos la primera página para saber el total de páginas.
  const API = process.env.NEXT_PUBLIC_RICKMORTY_API;
  const firstRes = await fetch(`${API}/character`);
  const firstData: CharacterListResponse = await firstRes.json();
  const totalPages = firstData.info.pages;

  // Razonamiento: recolectamos todos los IDs reales desde cada página.
  // Hacemos fetch secuencial para evitar rate limiting en build.
  const allIds: string[] = [];
  for (const character of firstData.results) {
    allIds.push(String(character.id));
  }

  for (let p = 2; p <= totalPages; p++) {
    const res = await fetch(
      `${API}/character?page=${p}`
    );
    if (res.ok) {
      const data: CharacterListResponse = await res.json();
      for (const character of data.results) {
        allIds.push(String(character.id));
      }
    }
  }

  return allIds.map((id) => ({ id }));
}

// ----------------------------------------------------------------
// generateMetadata: metadata dinámica por personaje
// ----------------------------------------------------------------

export async function generateMetadata({
  params,
}: CharacterDetailProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  return {
    title: `${character.name} - Rick & Morty`,
    description: `${character.name} - ${character.status} | ${character.species} | ${character.gender}`,
  };
}

// ----------------------------------------------------------------
// Helpers de color
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

function statusBorder(status: string): string {
  switch (status) {
    case "Alive":
      return "border-green-500";
    case "Dead":
      return "border-red-500";
    default:
      return "border-gray-500";
  }
}

// ----------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------

export default async function CharacterDetail({ params }: CharacterDetailProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Tarjeta principal */}
        <div
          className={`bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 ${statusBorder(character.status)}`}
        >
          {/* Header con imagen y nombre */}
          <div className="flex flex-col md:flex-row">
            {/* Imagen */}
            <div className="md:w-1/2 relative aspect-square md:aspect-auto">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Info principal */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold text-green-400 mb-2">
                {character.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className={`${statusColor(character.status)} text-white text-sm font-bold px-3 py-1 rounded-full`}
                >
                  {character.status}
                </span>
                <span className="bg-gray-700 text-gray-200 text-sm font-bold px-3 py-1 rounded-full">
                  {character.species}
                </span>
                {character.type && (
                  <span className="bg-purple-700 text-purple-200 text-sm font-bold px-3 py-1 rounded-full">
                    {character.type}
                  </span>
                )}
                <span className="bg-blue-700 text-blue-200 text-sm font-bold px-3 py-1 rounded-full">
                  {character.gender}
                </span>
              </div>

              {/* Campos detallados */}
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Origen
                  </span>
                  <p className="text-white font-medium">{character.origin.name}</p>
                </div>

                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Ubicación actual
                  </span>
                  <p className="text-white font-medium">
                    {character.location.name}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Registro creado
                  </span>
                  <p className="text-white font-medium">
                    {new Date(character.created).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    ID
                  </span>
                  <p className="text-green-400 font-mono font-bold">
                    #{character.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de episodios */}
          <div className="p-8 border-t border-gray-700/50">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Episodios ({character.episode.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {character.episode.map((epUrl) => {
                const epNumber = epUrl.split("/").pop();
                return (
                  <span
                    key={epUrl}
                    className="bg-gray-700/50 text-gray-300 text-center text-sm font-mono py-2 px-3 rounded-lg border border-gray-600/30"
                  >
                    Ep. {epNumber}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Footer con botón volver */}
          <div className="p-8 bg-gray-900/50 border-t border-gray-700/50 flex justify-between items-center">
            <Link
              href="/rickmorty"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              ← Volver a Personajes
            </Link>

            <span className="text-gray-500 text-sm">
              ISR • Revalidación cada 10 días
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}