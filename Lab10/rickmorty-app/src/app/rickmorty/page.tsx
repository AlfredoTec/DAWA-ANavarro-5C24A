import Link from "next/link";
import Image from "next/image";
import { CharacterListResponse } from "@/types/rickmorty";
import { GiCharacter } from "react-icons/gi";
import PageJumper from "./_components/PageJumper";

/**
 * @purpose Obtiene una página de personajes con reintento en caso de rate limit (429).
 *          Sin cache explícito: en producción Next.js cachea estáticamente.
 * @param page Número de página (1-based).
 * @param retries Número de reintentos restantes.
 * @returns Respuesta paginada con personajes e info.
 */
async function getCharactersByPage(
  page: number,
  retries = 2
): Promise<CharacterListResponse> {
  const API = process.env.NEXT_PUBLIC_RICKMORTY_API;
 
  // En getCharactersByPage:
  const res = await fetch(`${API}/character?page=${page}`);

  // Razonamiento: si la API devuelve 429 (rate limit), esperamos y reintentamos.
  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500));
    return getCharactersByPage(page, retries - 1);
  }

  if (!res.ok) {
    throw new Error(`Error al cargar personajes: status=${res.status}`);
  }

  return res.json();
}

/**
 * @purpose Mapea el status a un color de Tailwind para el badge.
 */
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
// Props: searchParams para paginación
// ----------------------------------------------------------------

interface RickmortyHomeProps {
  searchParams: Promise<{ page?: string }>;
}

// ----------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------

export default async function RickmortyHome({
  searchParams,
}: RickmortyHomeProps) {
  // Razonamiento: obtenemos la página desde los query params (?page=2).
  // Si no se especifica, por defecto es la página 1.
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const data = await getCharactersByPage(currentPage);
  const characters = data.results;
  const totalPages = data.info.pages;

  // Razonamiento: calculamos página anterior y siguiente para los botones.
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-green-400 drop-shadow-lg mb-4">
            <GiCharacter size={48} className="inline-block mr-3" />
            Personajes (SSG)
          </h1>
          <p className="text-gray-400 text-lg">
            {data.info.count} personajes en {totalPages} páginas • Generado en
            build time
          </p>
        </div>

        {/* Grid de personajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {characters.map((character) => (
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
        <div className="flex justify-center items-center gap-6 mt-12">
          {prevPage ? (
            <Link
              href={`/rickmorty?page=${prevPage}`}
              className="bg-gray-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition border border-gray-600 hover:border-green-500"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="bg-gray-800/50 text-gray-600 font-bold py-3 px-6 rounded-lg border border-gray-700/30 cursor-not-allowed">
              ← Anterior
            </span>
          )}

          <PageJumper currentPage={currentPage} totalPages={totalPages} />

          {nextPage ? (
            <Link
              href={`/rickmorty?page=${nextPage}`}
              className="bg-gray-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition border border-gray-600 hover:border-green-500"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="bg-gray-800/50 text-gray-600 font-bold py-3 px-6 rounded-lg border border-gray-700/30 cursor-not-allowed">
              Siguiente →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}