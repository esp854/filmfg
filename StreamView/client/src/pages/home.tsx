import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import HeroSection from "@/components/movie/hero-section";
import MovieCarousel from "@/components/movie/movie-carousel";
import MovieDetailModal from "@/components/movie/movie-detail-modal";
import VideoPlayer from "@/components/movie/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MovieWithGenres } from "@/lib/types";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<MovieWithGenres[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Fetch featured movie
  const { data: featuredMovie, isLoading: featuredLoading } = useQuery<MovieWithGenres>({
    queryKey: ["/api/movies/featured"],
  });

  // Fetch trending movies
  const { data: trendingMovies = [], isLoading: trendingLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/movies/trending"],
  });

  // Fetch all movies for additional carousels
  const { data: allMovies = [], isLoading: allMoviesLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/movies"],
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
    // TODO: Implement watchlist functionality
    toast({
      title: "Ajouté à votre liste",
      description: `${selectedMovie?.title} a été ajouté à votre liste de lecture.`,
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch action and drama movies from TMDB
  const { data: actionMovies = [] } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/genres/28/movies"], // Action genre ID in TMDB
    enabled: !searchResults.length
  });
  
  const { data: dramaMovies = [] } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/genres/18/movies"], // Drama genre ID in TMDB
    enabled: !searchResults.length
  });

  if (featuredLoading) {
    return (
      <div className="min-h-screen">
        <Header onSearch={handleSearch} />
        <div className="h-96 md:h-[500px]">
          <Skeleton className="w-full h-full bg-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} />
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="px-8 py-8">
          <MovieCarousel
            title="Résultats de recherche"
            movies={searchResults}
            onMovieClick={handleMovieClick}
          />
        </div>
      )}

      {/* Hero Section */}
      {featuredMovie && !searchResults.length && (
        <HeroSection
          movie={featuredMovie}
          onPlay={() => {
            setSelectedMovie(featuredMovie);
            handlePlay();
          }}
          onAddToWatchlist={handleAddToWatchlist}
          onShowDetails={() => handleMovieClick(featuredMovie)}
        />
      )}

      {/* Movie Carousels */}
      {!searchResults.length && (
        <div className="px-8 py-8 space-y-12">
          {trendingLoading ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Tendances actuelles</h2>
              <div className="flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="flex-none w-48 h-72 bg-gray-800 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <MovieCarousel
              title="Tendances actuelles"
              movies={trendingMovies}
              onMovieClick={handleMovieClick}
            />
          )}

          <MovieCarousel
            title="Films d'Action"
            movies={actionMovies}
            onMovieClick={handleMovieClick}
          />
          
          <MovieCarousel
            title="Films Dramatiques"
            movies={dramaMovies}
            onMovieClick={handleMovieClick}
          />
        </div>
      )}

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
        trailers={selectedMovie?.trailers}
      />
    </div>
  );
}
