'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MovieContextType {
  selectedMovieID: string | null;
  setSelectedMovieID: (id: string | null) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [selectedMovieID, setSelectedMovieID] = useState<string | null>(null);

  return (
    <MovieContext.Provider value={{ selectedMovieID, setSelectedMovieID }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}