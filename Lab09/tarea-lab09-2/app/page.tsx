import PopularMovies from './components/PopularMovies';
import ClientHome from './components/ClientHome';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Descubre Peliculas y Series
        </h2>
        <p className="text-gray-400">
          Explora peliculas populares o busca tus favoritas
        </p>
      </div>

      <ClientHome>
        <PopularMovies />
      </ClientHome>
    </div>
  );
}