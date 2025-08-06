import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import MovieCarousel from "@/components/movie/movie-carousel";
import type { MovieWithGenres } from "@/lib/types";

interface Genre {
  id: number;
  name: string;
  slug: string;
}

export default function Genres() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genres = [], isLoading: genresLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"]
  });

  const { data: genreMovies = [], isLoading: moviesLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/genres", selectedGenre, "movies"],
    enabled: !!selectedGenre
  });

  const handleMovieClick = (movie: MovieWithGenres) => {
    // Navigation vers la page de détails du film
    window.location.href = `/movies/${movie.id}`;
  };

  // Couleurs pour les genres
  const genreColors = [
    "bg-red-600", "bg-blue-600", "bg-green-600", "bg-yellow-600", 
    "bg-purple-600", "bg-pink-600", "bg-indigo-600", "bg-orange-600",
    "bg-teal-600", "bg-cyan-600", "bg-lime-600", "bg-amber-600"
  ];

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explorer par Genre</h1>
        <p className="text-gray-400 text-lg">
          Découvrez des films par catégorie et trouvez votre prochain favori
        </p>
      </div>

      {/* Genres Grid */}
      {genresLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-gray-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {genres.map((genre, index) => (
            <Card
              key={genre.id}
              className={`${genreColors[index % genreColors.length]} border-0 cursor-pointer hover:scale-105 transition-transform duration-200 ${
                selectedGenre === genre.id ? 'ring-2 ring-white' : ''
              }`}
              onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
            >
              <CardContent className="p-6 flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2">{genre.name}</h3>
                  <p className="text-sm opacity-90">Cliquez pour explorer</p>
                </div>
                <div className="flex items-center">
                  <Film className="w-8 h-8 opacity-75" />
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Genre Movies */}
      {selectedGenre && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Films - {genres.find(g => g.id === selectedGenre)?.name}
            </h2>
            <Button
              variant="outline"
              onClick={() => setSelectedGenre(null)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Fermer
            </Button>
          </div>
          
          {moviesLoading ? (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="flex-none w-48 h-72 bg-gray-800 rounded-lg" />
              ))}
            </div>
          ) : genreMovies.length > 0 ? (
            <MovieCarousel
              title=""
              movies={genreMovies}
              onMovieClick={handleMovieClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun film trouvé dans cette catégorie</p>
            </div>
          )}
        </div>
      )}

      {/* Popular Genres Quick Access */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Genres Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-red-600 to-red-800 border-0">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Action & Aventure</h3>
              <p className="text-red-100 mb-4">Films d'action, thriller et aventure</p>
              <Button 
                variant="secondary" 
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => setSelectedGenre(28)} // Action genre ID
              >
                Explorer maintenant
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-0">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Drame</h3>
              <p className="text-blue-100 mb-4">Histoires émotionnelles et captivantes</p>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setSelectedGenre(18)} // Drama genre ID
              >
                Explorer maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}