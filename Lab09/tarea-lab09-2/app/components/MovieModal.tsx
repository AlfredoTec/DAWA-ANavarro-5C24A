'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { useMovieContext } from './MovieContext';

// CSR: El modal se muestra como respuesta a la interaccion del usuario (clic en pelicula).
// Los detalles se obtienen via fetch en el cliente porque dependen del imdbID seleccionado.
export default function MovieModal() {
  const { selectedMovieID, setSelectedMovieID } = useMovieContext();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const API_KEY = process.env.OMDB_API_KEY;
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedMovieID}&plot=full`
        );
        const data = await response.json();
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError('No se pudieron cargar los detalles de la pelicula');
        }
      } catch {
        setError('Error al cargar los detalles');
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedMovieID) {
      fetchMovieDetails();
    }
  }, [selectedMovieID]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMovieID(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setSelectedMovieID]);

  if (!selectedMovieID) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-gray-900 bg-opacity-95">
          <button
            onClick={() => setSelectedMovieID(null)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-8">{error}</div>
        ) : movie ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                  alt={movie.Title}
                  width={300}
                  height={450}
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              </div>

              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-white mb-2">{movie.Title}</h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {movie.Year}
                  </span>
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                    {movie.Rated}
                  </span>
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    {movie.Runtime}
                  </span>
                  <span className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
                    ⭐ {movie.imdbRating}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{movie.Plot}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Genero:</span>
                    <span className="text-white ml-2">{movie.Genre}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <span className="text-white ml-2">{movie.Director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Actores:</span>
                    <span className="text-white ml-2">{movie.Actors}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Idioma:</span>
                    <span className="text-white ml-2">{movie.Language}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Pais:</span>
                    <span className="text-white ml-2">{movie.Country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Premios:</span>
                    <span className="text-white ml-2">{movie.Awards}</span>
                  </div>
                  {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                    <div>
                      <span className="text-gray-400">Taquilla:</span>
                      <span className="text-white ml-2">{movie.BoxOffice}</span>
                    </div>
                  )}
                </div>

                {movie.Ratings && movie.Ratings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-white font-semibold mb-2">Ratings:</h3>
                    <div className="flex gap-4">
                      {movie.Ratings.map((rating, index) => (
                        <div key={index} className="text-center">
                          <div className="text-white font-bold">{rating.Value}</div>
                          <div className="text-gray-400 text-xs">{rating.Source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}