'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { MovieSearchResult } from '../types/movie';
import { useMovieContext } from './MovieContext';

// CSR: La busqueda es interactiva y debe responder en tiempo real sin recargar la pagina.
// Usamos CSR con debounce para optimizar las llamadas a la API mientras el usuario escribe.
export default function SearchBar() {
  const { setSelectedMovieID } = useMovieContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${value}`
        );
        const data = await response.json();
        if (data.Response === 'True') {
          setResults(data.Search);
          setShowResults(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error en la busqueda:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSelectMovie = (imdbID: string) => {
    setSelectedMovieID(imdbID);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar peliculas o series..."
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {results.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => handleSelectMovie(movie.imdbID)}
              className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex-shrink-0 w-12 h-16 mr-3 relative">
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                  alt={movie.Title}
                  fill
                  sizes="48px"
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{movie.Title}</h3>
                <p className="text-gray-400 text-sm">
                  {movie.Year} - {movie.Type}
                </p>
              </div>
              <span className="text-gray-500 text-xs uppercase bg-gray-900 px-2 py-1 rounded">
                {movie.Type}
              </span>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 3 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4">
          <p className="text-gray-400 text-center">
            No se encontraron resultados para &​ldquo;{query}&​rdquo;
          </p>
        </div>
      )}
    </div>
  );
}