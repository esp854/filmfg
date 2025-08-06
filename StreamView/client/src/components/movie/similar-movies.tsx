import MovieCard from "./movie-card";
import type { MovieWithGenres } from "@/lib/types";

interface SimilarMoviesProps {
  movies: MovieWithGenres[];
  onMovieClick: (movie: MovieWithGenres) => void;
}

export default function SimilarMovies({ movies, onMovieClick }: SimilarMoviesProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-6">Films similaires</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick(movie)}
          />
        ))}
      </div>
    </div>
  );
}