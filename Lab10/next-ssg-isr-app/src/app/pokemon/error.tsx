'use client'; // Los componentes de error deben ser Client Components 

import { useEffect } from 'react';
import { IoAlertCircle } from 'react-icons/io5';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcionalmente puedes reportar el error a un servicio externo
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
        <IoAlertCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Algo salió mal!</h2>
        <p className="text-gray-600 mb-6">
          Hubo un error al cargar la información de los Pokémon.
        </p>
        <button
          onClick={() => reset()} // Intenta recuperar la ruta renderizando de nuevo 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}