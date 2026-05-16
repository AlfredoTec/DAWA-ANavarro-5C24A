'use client';

import SearchBar from './SearchBar';
import MovieModal from './MovieModal';
import { MovieProvider } from './MovieContext';

export default function ClientHome({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <SearchBar />
      {children}
      <MovieModal />
    </MovieProvider>
  );
}