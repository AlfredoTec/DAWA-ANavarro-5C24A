'use client';

import Image from 'next/image';
import { PopularMovie } from '../types/movie';
import { useMovieContext } from './MovieContext';

interface MovieCardProps {
  movie: PopularMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { setSelectedMovieID } = useMovieContext();

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => setSelectedMovieID(movie.imdbID)}
    >
      <div className="relative h-64">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs">
          {movie.year} - {movie.type}
        </p>
      </div>
    </div>
  );
}