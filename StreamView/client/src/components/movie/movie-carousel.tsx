import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./movie-card";
import type { MovieWithGenres } from "@/lib/types";

interface MovieCarouselProps {
  title: string;
  movies: MovieWithGenres[];
  onMovieClick: (movie: MovieWithGenres) => void;
}

export default function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 768; // Width of 4 cards
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies.length) {
    return (
      <div className="movie-carousel">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-gray-400 text-center py-8">
          Aucun film disponible dans cette catégorie.
        </div>
      </div>
    );
  }

  return (
    <div className="movie-carousel">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="relative group">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => onMovieClick(movie)} 
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
