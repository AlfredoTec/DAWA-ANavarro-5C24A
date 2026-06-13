"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signIn");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Mi Perfil
        </h1>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-full ring-4 ring-blue-500"
          />
        )}
        <div className="w-full flex flex-col gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
              Nombre
            </p>
            <p className="text-gray-800 dark:text-white font-semibold mt-1">
              {session.user?.name}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
              Correo electrónico
            </p>
            <p className="text-gray-800 dark:text-white font-semibold mt-1">
              {session.user?.email}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Dashboard
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
