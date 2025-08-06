import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MovieWithGenres } from "@/lib/types";

interface MovieCardProps {
  movie: MovieWithGenres;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      className="group cursor-pointer bg-dark-card rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 flex-none w-48 md:w-56"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                <span>{movie.rating}</span>
              </div>
              <span>{movie.year}</span>
            </div>
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
              {movie.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre) => (
                <Badge 
                  key={genre.id} 
                  variant="secondary" 
                  className="text-xs px-1 py-0 bg-black bg-opacity-60"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}