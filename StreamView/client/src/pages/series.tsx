import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Play, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { MovieWithGenres } from "@/lib/types";

export default function Series() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Récupération des séries depuis l'API dédiée
  const { data: series = [], isLoading } = useQuery<MovieWithGenres[]>({
    queryKey: ["/api/series"]
  });

  const filteredSeries = series.filter(serie =>
    serie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Séries TV</h1>
        <p className="text-gray-400 text-lg">
          Découvrez nos séries les plus populaires et les dernières nouveautés
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Rechercher une série..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-dark-card border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Series Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full bg-gray-800 rounded-lg" />
              <Skeleton className="h-4 bg-gray-800 rounded" />
              <Skeleton className="h-3 w-2/3 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredSeries.map((serie) => (
              <Card 
                key={serie.id} 
                className="bg-dark-card border-gray-700 hover:border-netflix-red transition-colors group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <img
                      src={serie.posterUrl}
                      alt={serie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Link href={`/series/${serie.id}`}>
                          <Button size="sm" variant="secondary" className="bg-dark-card text-white">
                            <Info className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate mb-2">{serie.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">Saison 1 • {serie.year}</p>
                    <div className="flex flex-wrap gap-1">
                      {serie.genres.slice(0, 2).map((genre) => (
                        <Badge 
                          key={genre.id} 
                          variant="secondary" 
                          className="text-xs bg-gray-700 text-gray-300"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSeries.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">Aucune série trouvée</h3>
              <p className="text-gray-400">
                Essayez d'autres mots-clés ou parcourez nos catégories
              </p>
            </div>
          )}

          {filteredSeries.length === 0 && !searchQuery && !isLoading && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">Catalogue de séries à venir</h3>
              <p className="text-gray-400 mb-6">
                Nous préparons actuellement notre collection de séries TV. 
                Revenez bientôt pour découvrir les meilleures séries !
              </p>
              <Button className="bg-netflix-red hover:bg-red-700">
                Être notifié du lancement
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}