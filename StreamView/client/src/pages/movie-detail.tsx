import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Play, Plus, Share2, Star, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/movie/video-player";
import TrailerSection from "@/components/movie/trailer-section";
import SimilarMovies from "@/components/movie/similar-movies";
import { useToast } from "@/hooks/use-toast";
import type { MovieWithGenres } from "@/lib/types";

interface MovieDetails {
  movie: MovieWithGenres;
  similarMovies: MovieWithGenres[];
  trailers: Array<{
    key: string;
    name: string;
    type: string;
    url: string;
  }>;
}

export default function MovieDetail() {
  const { id } = useParams();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);
  const { toast } = useToast();

  const { data: movieDetails, isLoading, error } = useQuery<MovieDetails>({
    queryKey: ["/api/movies", id, "details"],
    enabled: !!id,
  });

  const movie = movieDetails?.movie;

  const handleAddToWatchlist = async () => {
    toast({
      title: "Ajouté à votre liste",
      description: `${movie?.title} a été ajouté à votre liste de lecture.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="relative h-64 md:h-80">
          <Skeleton className="w-full h-full bg-gray-800" />
        </div>
        <div className="px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="h-96 bg-gray-800 rounded-lg" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 bg-gray-800 rounded" />
              <Skeleton className="h-4 bg-gray-800 rounded w-1/3" />
              <Skeleton className="h-24 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Film non trouvé</h1>
          <p className="text-gray-400 mb-6">Ce film n'existe pas ou a été supprimé.</p>
          <Link href="/movies">
            <Button>Retour aux films</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Backdrop Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
        
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="px-8 py-8">
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

            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              {movie.description}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="bg-dark-card">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Casting</h3>
              <p className="text-gray-300">{movie.cast.join(", ")}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Réalisateur</h3>
              <p className="text-gray-300">{movie.director}</p>
            </div>

            <div className="flex space-x-4">
              <Link href={`/watch/${id}`}>
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Lecture
                </Button>
              </Link>
              <Button
                onClick={handleAddToWatchlist}
                variant="secondary"
                className="bg-dark-card text-white hover:bg-gray-700 font-semibold px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ma Liste
              </Button>
              <Button
                variant="secondary"
                className="bg-dark-card text-white hover:bg-gray-700 font-semibold px-8 py-3"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>

        {/* Trailers Section */}
        {movieDetails?.trailers && movieDetails.trailers.length > 0 && (
          <div className="px-8 py-8">
            <TrailerSection 
              trailers={movieDetails.trailers} 
              movieTitle={movie.title} 
            />
          </div>
        )}

        {/* Similar Movies Section */}
        {movieDetails?.similarMovies && movieDetails.similarMovies.length > 0 && (
          <div className="px-8 py-8">
            <SimilarMovies 
              movies={movieDetails.similarMovies}
              onMovieClick={setSelectedMovie}
            />
          </div>
        )}
      </div>

      {/* Video Player */}
      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={movie?.videoUrl || undefined}
        title={movie?.title}
        trailers={movieDetails?.trailers}
      />

      {/* Similar Movie Detail Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedMovie.backdropUrl}
                alt={selectedMovie.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">{selectedMovie.title}</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{selectedMovie.rating}</span>
                </div>
                <span>{selectedMovie.year}</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{Math.floor(selectedMovie.duration / 60)}h {selectedMovie.duration % 60}min</span>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{selectedMovie.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMovie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              <Link href={`/movies/${selectedMovie.id}`}>
                <Button 
                  onClick={() => setSelectedMovie(null)}
                  className="w-full bg-netflix-red hover:bg-red-700"
                >
                  Voir les détails
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
