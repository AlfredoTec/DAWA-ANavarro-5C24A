import authMiddleware from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

/**
 * @purpose Ejecutar la protección de NextAuth desde el archivo proxy requerido por Next.js 16.
 * @dependencies next-auth/middleware, next/server
 * @side_effects Redirige solicitudes no autenticadas hacia el flujo de inicio de sesión configurado.
 */
export function proxy(request: NextRequestWithAuth) {
  // Razonamiento: Next.js 16 valida explícitamente que proxy.ts exporte una función llamada proxy o default.
  return authMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
