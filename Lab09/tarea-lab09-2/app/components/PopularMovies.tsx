import { PopularMovie } from '../types/movie';
import MovieCard from './MovieCard';

// SSR: Esta funcion se ejecuta en el servidor al momento del request.
// Usamos SSR porque los datos de peliculas populares son relativamente estaticos
// y queremos que el contenido este disponible inmediatamente para SEO y rendimiento.
async function getPopularMovies(): Promise<PopularMovie[]> {
  const API_KEY = process.env.OMDB_API_KEY;
  const popularTitles = [
    'Inception',
    'The Dark Knight',
    'Interstellar',
    'The Matrix',
    'Pulp Fiction'
  ];

  const movies = await Promise.all(
    popularTitles.map(async (title) => {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`,
        { next: { revalidate: 3600 } }
      );
      const data = await response.json();

      return {
        title: data.Title,
        year: data.Year,
        imdbID: data.imdbID,
        poster: data.Poster !== 'N/A' ? data.Poster : '/placeholder.jpg',
        type: data.Type
      };
    })
  );

  return movies.filter(movie => movie.title);
}

export default async function PopularMovies() {
  const popularMovies = await getPopularMovies();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Peliculas Populares
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {popularMovies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}