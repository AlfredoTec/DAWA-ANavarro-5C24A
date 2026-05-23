import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiFilm } from "react-icons/fi";
import { Character } from "@/types/rickmorty";

interface Props {
  character: Character;
}

const statusConfig = {
  Alive: { color: "#39ff14", label: "Vivo", glow: "rgba(57,255,20,0.6)" },
  Dead: { color: "#ff4444", label: "Muerto", glow: "rgba(255,68,68,0.6)" },
  unknown: { color: "#888888", label: "Desconocido", glow: "rgba(136,136,136,0.4)" },
};

export default function CharacterCard({ character }: Props) {
  const status = statusConfig[character.status] ?? statusConfig.unknown;

  return (
    <Link href={`/rickmorty/${character.id}`} className="block group">
      <article
        className="card-hover rounded-xl overflow-hidden border border-[#1e3a5f] bg-[#0f1828] h-full"
        style={{
          background: "linear-gradient(145deg, #0f1828 0%, #0a1020 100%)",
        }}
      >
        {/* Image container */}
        <div className="relative overflow-hidden aspect-square">
          {/* Lazy loading image — carga solo cuando entra en viewport */}
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1020]/80 via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(5,10,18,0.8)", border: `1px solid ${status.color}` }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: status.color,
                  boxShadow: `0 0 6px ${status.glow}`,
                }}
              />
              {status.label}
            </span>
          </div>

          {/* ID badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded-md text-xs font-mono text-[#8896b0]"
              style={{ background: "rgba(5,10,18,0.8)" }}
            >
              #{character.id}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <div>
            <h2
              className="text-white font-bold text-base leading-tight line-clamp-1 group-hover:text-[#39ff14] transition-colors"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {character.name}
            </h2>
            <p className="text-[#8896b0] text-sm mt-0.5">
              {character.species}
              {character.type && (
                <span className="text-[#00d4ff]"> · {character.type}</span>
              )}
            </p>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2 text-[#8896b0]">
              <FiMapPin className="text-[#39ff14] mt-0.5 flex-shrink-0 text-base" />
              <span className="line-clamp-1">{character.location.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8896b0]">
              <FiFilm className="text-[#00d4ff] flex-shrink-0 text-base" />
              <span>{character.episode.length} episodio{character.episode.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
