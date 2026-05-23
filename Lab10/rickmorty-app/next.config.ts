import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Razonamiento: next/image requiere configurar dominios externos
  // para optimizar y servir imágenes desde la API de Rick and Morty.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
        pathname: "/api/character/avatar/**",
      },
    ],
  },
};

export default nextConfig;