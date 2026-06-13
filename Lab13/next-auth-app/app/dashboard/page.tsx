"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function DashboardPage() {
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
          Dashboard
        </h1>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Hola, <span className="font-semibold">{session.user?.name}</span>
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {session.user?.email}
        </p>
        <div className="flex gap-4">
          <Link
            href="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver perfil
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
