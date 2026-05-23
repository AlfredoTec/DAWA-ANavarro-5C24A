"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PageJumperProps {
  currentPage: number;
  totalPages: number;
}

/**
 * @purpose Input para saltar directamente a una página específica.
 *          CSR porque requiere interacción del usuario (input + navegación).
 */
export default function PageJumper({ totalPages }: PageJumperProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleJump = () => {
    const page = Number(value);
    if (page >= 1 && page <= totalPages) {
      router.push(`/rickmorty?page=${page}`);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleJump();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={totalPages}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`1-${totalPages}`}
        className="w-20 bg-gray-900 text-white text-center border border-gray-600 rounded-lg px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={handleJump}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg transition"
      >
        Ir
      </button>
    </div>
  );
}