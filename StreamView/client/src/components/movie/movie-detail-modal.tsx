import { X, Play, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { MovieWithGenres } from "@/lib/types";

interface MovieDetailModalProps {
  movie: MovieWithGenres | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  onAddToWatchlist: () => void;
}

export default function MovieDetailModal({
  movie,
  isOpen,
  onClose,
  onPlay,
  onAddToWatchlist,
}: MovieDetailModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-dark-card border-gray-700 p-0">
        <div className="relative">
          {/* Movie backdrop image */}
          <div className="h-64 md:h-80 overflow-hidden rounded-t-lg">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent"></div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="md:col-span-1">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Movie Details */}
              <div className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <Badge className="bg-yellow-500 text-black px-2 py-1 text-sm font-semibold">
                    IMDb {movie.rating}
                  </Badge>
                  <span className="text-gray-300">{movie.year}</span>
                  <span className="text-gray-300">
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                  </span>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {movie.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary" className="bg-dark-bg">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Casting</h3>
                  <p className="text-gray-300">{movie.cast.join(", ")}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Réalisateur</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={onPlay} className="bg-white text-black hover:bg-gray-200 font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    Lecture
                  </Button>
                  <Button
                    onClick={onAddToWatchlist}
                    variant="secondary"
                    className="bg-dark-bg text-white hover:bg-gray-800 font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ma Liste
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-dark-bg text-white hover:bg-gray-800 font-semibold"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
