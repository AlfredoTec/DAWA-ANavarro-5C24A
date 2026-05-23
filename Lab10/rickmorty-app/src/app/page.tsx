import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050a12] flex flex-col items-center justify-center relative overflow-hidden stars">
      {/* Animated portal rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full border-2 border-[#39ff14]/10 spin-slow"
          style={{ boxShadow: "0 0 60px rgba(57,255,20,0.05)" }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full border border-[#39ff14]/15 spin-reverse"
          style={{ boxShadow: "0 0 40px rgba(57,255,20,0.08)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full border border-[#39ff14]/20 spin-slow"
          style={{ boxShadow: "0 0 30px rgba(57,255,20,0.12)" }}
        />
        {/* Portal center glow */}
        <div
          className="absolute w-40 h-40 rounded-full portal-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(57,255,20,0.25) 0%, rgba(0,212,255,0.1) 50%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 slide-up">
        {/* Title */}
        <div className="mb-2 float-anim">
          <span
            className="text-sm font-semibold tracking-[0.4em] uppercase text-[#00d4ff]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Wubba Lubba Dub Dub
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-2 leading-tight"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="neon-green text-[#39ff14]">Rick</span>
          <span className="text-white"> & </span>
          <span className="text-[#00d4ff] neon-blue">Morty</span>
        </h1>

        <h2
          className="text-xl md:text-2xl font-light text-[#8896b0] mb-10 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          Universe Explorer
        </h2>

        <p className="text-[#8896b0] max-w-lg mx-auto mb-10 text-lg leading-relaxed">
          Explora más de{" "}
          <span className="text-[#39ff14] font-semibold">800+ personajes</span>{" "}
          del multiverso de Rick & Morty. Busca, filtra y descubre cada detalle
          de tus favoritos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/rickmorty"
            className="glow-pulse px-8 py-4 bg-[#39ff14] text-[#050a12] font-bold text-lg rounded-full uppercase tracking-widest transition-all hover:bg-[#55ff40] hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Ver Personajes
          </Link>
          <Link
            href="/rickmorty/search"
            className="px-8 py-4 border-2 border-[#00d4ff] text-[#00d4ff] font-semibold text-lg rounded-full uppercase tracking-widest transition-all hover:bg-[#00d4ff]/10 hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Buscar
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center">
          {[
            { value: "826+", label: "Personajes" },
            { value: "51", label: "Episodios" },
            { value: "126", label: "Locaciones" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-black text-[#39ff14]"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {stat.value}
              </div>
              <div className="text-[#8896b0] text-sm tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050a12] to-transparent pointer-events-none" />
    </main>
  );
}
