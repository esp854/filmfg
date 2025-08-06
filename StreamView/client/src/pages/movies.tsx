import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MovieCarousel from "@/components/movie/movie-carousel";
import MovieDetailModal from "@/components/movie/movie-detail-modal";
import VideoPlayer from "@/components/movie/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MovieWithGenres } from "@/lib/types";

export default function Movies() {
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieWithGenres[]>([]);
  const { toast } = useToast();

  const { data: allMovies = [], isLoading: allMoviesLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/movies"],
  });

  const { data: trendingMovies = [], isLoading: trendingLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/movies/trending"],
  });

  const { data: actionMovies = [] } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/genres/28/movies"],
  });
  
  const { data: dramaMovies = [] } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/genres/18/movies"],
  });

  const handleMovieClick = (movie: MovieWithGenres) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handlePlay = () => {
    setIsModalOpen(false);
    setIsPlayerOpen(true);
  };

  const handleAddToWatchlist = async () => {
    toast({
      title: "Ajouté à votre liste",
      description: `${selectedMovie?.title} a été ajouté à votre liste de lecture.`,
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold mb-6">Films</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher un film..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-10 bg-dark-card border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 space-y-12">
        {searchResults.length > 0 ? (
          <MovieCarousel
            title={`Résultats de recherche (${searchResults.length})`}
            movies={searchResults}
            onMovieClick={handleMovieClick}
          />
        ) : (
          <>
            {/* Trending Movies */}
            {trendingLoading ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Films Populaires</h2>
                <div className="flex space-x-6 overflow-x-auto">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="flex-none w-48 h-72 bg-gray-800 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <MovieCarousel
                title="Films Populaires"
                movies={trendingMovies}
                onMovieClick={handleMovieClick}
              />
            )}

            {/* All Movies */}
            {allMoviesLoading ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Nouveautés</h2>
                <div className="flex space-x-6 overflow-x-auto">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="flex-none w-48 h-72 bg-gray-800 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <MovieCarousel
                title="Nouveautés"
                movies={allMovies}
                onMovieClick={handleMovieClick}
              />
            )}

            {/* Action Movies */}
            <MovieCarousel
              title="Films d'Action"
              movies={actionMovies}
              onMovieClick={handleMovieClick}
            />

            {/* Drama Movies */}
            <MovieCarousel
              title="Films Dramatiques"
              movies={dramaMovies}
              onMovieClick={handleMovieClick}
            />
          </>
        )}
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={handlePlay}
        onAddToWatchlist={handleAddToWatchlist}
      />

      {/* Video Player */}
      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={selectedMovie?.videoUrl || undefined}
        title={selectedMovie?.title}
      />
    </div>
  );
}
