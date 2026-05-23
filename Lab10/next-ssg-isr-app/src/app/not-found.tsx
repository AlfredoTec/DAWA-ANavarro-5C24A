'use client';

export default function NotFound() {
  // Manejador alternativo para simular la navegación en entornos donde no hay router nativo cargado
  const handleRedirect = () => {
    window.location.href = '/pokemon';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white px-4">
      <div className="max-w-md w-full text-center space-y-8 p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        
        {/* Gráfico SVG Personalizado: Un radar/Pokébola de búsqueda perdida */}
        <div className="flex justify-center">
          <svg
            className="w-40 h-40 animate-pulse text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" className="opacity-30" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
            <circle cx="12" cy="12" r="3" className="fill-indigo-500 stroke-none" />
            <path d="M12 15a3 3 0 1 0 0-6" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-200">
            ¡Zona inexplorada detectada!
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Parece que el Pokémon salvaje o la dimensión que buscas ha escapado de nuestros radares. El recurso que intentas encontrar no existe o se ha movido de universo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Volver atrás
          </button>
          
          <button
            onClick={handleRedirect}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center cursor-pointer text-white"
          >
            Ir al Inicio
          </button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-slate-500">
        Laboratorio Next.js — Enrutamiento y Estrategias de Renderizado
      </footer>
    </div>
  );
}