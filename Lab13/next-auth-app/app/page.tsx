"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Bienvenido
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Inicia sesión para acceder a la aplicación
        </p>
        <button
          onClick={() => router.push("/signIn")}
          className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full justify-center"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex items-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium w-full justify-center"
        >
          <FcGoogle size={22} />
          <span>Continuar con Google</span>
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium w-full justify-center"
        >
          <FaGithub size={22} />
          <span>Continuar con GitHub</span>
        </button>
      </div>
    </div>
  );
}
