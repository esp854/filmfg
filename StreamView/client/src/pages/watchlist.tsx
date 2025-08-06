import { useState, useEffect } from "react";
import { Heart, Trash2, Play, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Interface pour les films dans la liste de lecture
interface WatchlistMovie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  year: number;
  duration: number;
  rating: number;
  genres: Array<{ id: number; name: string }>;
  addedAt: Date;
}

// Données d'exemple pour la liste de lecture
const mockWatchlist: WatchlistMovie[] = [
  {
    id: 278,
    title: "Les Évadés",
    posterUrl: "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
    description: "Accusé du meurtre de sa femme, Andy Dufresne, à la suite d'un procès expéditif, est condamné à la prison à vie. Là il se lie d'amitié avec Red, un autre détenu. Commence alors une grande histoire d'amitié entre les deux hommes.",
    year: 1994,
    duration: 142,
    rating: 9.3,
    genres: [{ id: 18, name: "Drame" }, { id: 80, name: "Crime" }],
    addedAt: new Date("2024-01-15")
  },
  {
    id: 238,
    title: "Le Parrain",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    description: "En 1945, à New York, les Corleone sont une des cinq familles de la mafia. Don Vito Corleone, \"parrain\" de cette famille, marie sa fille à un bookmaker.",
    year: 1972,
    duration: 175,
    rating: 9.2,
    genres: [{ id: 18, name: "Drame" }, { id: 80, name: "Crime" }],
    addedAt: new Date("2024-01-10")
  },
  {
    id: 680,
    title: "Pulp Fiction",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    description: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent.",
    year: 1994,
    duration: 154,
    rating: 8.9,
    genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drame" }],
    addedAt: new Date("2024-01-20")
  }
];

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>(mockWatchlist);
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating" | "addedAt">("addedAt");
  const { toast } = useToast();

  const removeFromWatchlist = (movieId: number) => {
    const movie = watchlist.find(m => m.id === movieId);
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
    
    if (movie) {
      toast({
        title: "Retiré de votre liste",
        description: `${movie.title} a été retiré de votre liste de lecture.`,
      });
    }
  };

  const clearWatchlist = () => {
    setWatchlist([]);
    toast({
      title: "Liste vidée",
      description: "Tous les films ont été retirés de votre liste.",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "year":
        return b.year - a.year;
      case "rating":
        return b.rating - a.rating;
      case "addedAt":
        return b.addedAt.getTime() - a.addedAt.getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-netflix-red/20 to-purple-600/20 backdrop-blur-sm border-b border-gray-700">
        <div className="px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center">
                <Heart className="w-12 h-12 mr-4 text-netflix-red" />
                Ma Liste
              </h1>
              <p className="text-xl text-gray-300">
                {watchlist.length} film{watchlist.length !== 1 ? 's' : ''} dans votre collection personnelle
              </p>
            </div>
            {watchlist.length > 0 && (
              <Button
                onClick={clearWatchlist}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider la liste
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {watchlist.length === 0 ? (
          /* État vide avec design amélioré */
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto border border-gray-700/50">
              <Heart className="w-24 h-24 mx-auto mb-6 text-gray-600" />
              <h3 className="text-3xl font-bold mb-4 text-gray-200">Votre liste est vide</h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Découvrez des films exceptionnels et créez votre collection personnelle. 
                Cliquez sur le cœur des films qui vous intéressent pour les ajouter ici.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Découvrir des films
                  </Button>
                </Link>
                <Link href="/genres">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3 rounded-full text-lg">
                    Parcourir par genre
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filtres de tri */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-400 font-medium">Trier par :</span>
              {[
                { key: "addedAt", label: "Date d'ajout" },
                { key: "title", label: "Titre" },
                { key: "year", label: "Année" },
                { key: "rating", label: "Note" }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={sortBy === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(key as typeof sortBy)}
                  className={
                    sortBy === key 
                      ? "bg-netflix-red hover:bg-red-700" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Grille des films */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedWatchlist.map((movie) => (
                <Card 
                  key={movie.id} 
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700/50 hover:border-netflix-red/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-netflix-red/10"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-lg" />
                      
                      {/* Actions overlay */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => removeFromWatchlist(movie.id)}
                          className="bg-red-600/90 hover:bg-red-700 text-white rounded-full p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Info overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white mb-2">
                          <Badge className="bg-netflix-red text-white">
                            ★ {movie.rating}
                          </Badge>
                          <span className="text-sm bg-black/50 px-2 py-1 rounded">
                            {movie.year} • {formatDuration(movie.duration)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{movie.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {movie.genres.map((genre) => (
                          <Badge 
                            key={genre.id} 
                            variant="secondary" 
                            className="bg-gray-700/50 text-gray-300 text-xs"
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Ajouté le {formatDate(movie.addedAt)}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/movies/${movie.id}`} className="flex-1">
                          <Button className="w-full bg-white text-black hover:bg-gray-200">
                            <Play className="w-4 h-4 mr-2" />
                            Regarder
                          </Button>
                        </Link>
                        <Link href={`/movies/${movie.id}`}>
                          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            Détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}