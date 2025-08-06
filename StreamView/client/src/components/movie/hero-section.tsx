import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MovieWithGenres } from "@/lib/types";

interface HeroSectionProps {
  movie: MovieWithGenres;
  onPlay: () => void;
  onAddToWatchlist: () => void;
  onShowDetails: () => void;
}

export default function HeroSection({ movie, onPlay, onAddToWatchlist, onShowDetails }: HeroSectionProps) {
  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-transparent z-10"></div>
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="px-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
            {movie.description}
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <Badge className="bg-yellow-500 text-black px-2 py-1 text-sm font-semibold">
              IMDb {movie.rating}
            </Badge>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-300">{Math.floor(movie.duration / 60)}h {movie.duration % 60}min</span>
            <span className="text-gray-300">
              {movie.genres.map(g => g.name).join(", ")}
            </span>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={onPlay}
              className="bg-white text-black px-8 py-3 hover:bg-gray-200 font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Lecture
            </Button>
            <Button
              onClick={onAddToWatchlist}
              variant="secondary"
              className="bg-dark-card bg-opacity-70 backdrop-blur-sm text-white px-8 py-3 hover:bg-opacity-90 font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ma Liste
            </Button>
            <Button
              onClick={onShowDetails}
              variant="secondary"
              className="bg-dark-card bg-opacity-70 backdrop-blur-sm text-white px-4 py-3 hover:bg-opacity-90"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
