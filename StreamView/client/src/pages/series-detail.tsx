import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Play, Plus, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/movie/video-player";
import TrailerSection from "@/components/movie/trailer-section";
import type { MovieWithGenres } from "@/lib/types";

interface SeriesDetails {
  series: MovieWithGenres;
  trailers: Array<{
    key: string;
    name: string;
    type: string;
    url: string;
  }>;
}

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  const { data: seriesDetails, isLoading, error } = useQuery<SeriesDetails>({
    queryKey: ["/api/series", id, "details"],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="relative h-96">
          <Skeleton className="w-full h-full bg-gray-800" />
        </div>
        <div className="px-8 py-8 space-y-6">
          <Skeleton className="h-8 w-64 bg-gray-800" />
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-3/4 bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error || !seriesDetails?.series) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Série non trouvée</h1>
          <p className="text-gray-400 mb-6">La série demandée est introuvable.</p>
          <Link href="/series">
            <Button className="bg-netflix-red hover:bg-red-700">
              Retour aux séries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { series, trailers } = seriesDetails;

  const handlePlayTrailer = (trailerKey: string) => {
    setSelectedTrailer(trailerKey);
    setIsPlayerOpen(true);
  };

  const handleAddToWatchlist = () => {
    toast({
      title: "Ajouté à votre liste",
      description: `${series.title} a été ajouté à votre liste de lecture.`,
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${series.backdropUrl || series.posterUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Link href="/series">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        {/* Series Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-white mb-4">{series.title}</h1>
            
            <div className="flex items-center space-x-6 text-white mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{series.rating}/10</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-1" />
                <span>{series.year}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-1" />
                <span>Saisons multiples</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href={`/watch/${id}`}>
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Regarder
                </Button>
              </Link>
              
              <Button
                onClick={handleAddToWatchlist}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ma Liste
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-12 space-y-12">
        {/* Description and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {series.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {series.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="bg-gray-700 text-gray-300">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-dark-card border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Année</span>
                    <span className="text-white">{series.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Note</span>
                    <span className="text-white">{series.rating}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white">Série TV</span>
                  </div>
                  {series.director && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Créateur</span>
                      <span className="text-white">{series.director}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trailers Section */}
        {trailers && trailers.length > 0 && (
          <TrailerSection
            trailers={trailers}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {/* Episodes Section (Mock) */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Épisodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((episode) => (
              <Card key={episode} className="bg-dark-card border-gray-700 hover:border-netflix-red transition-colors group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={series.backdropUrl || series.posterUrl}
                      alt={`Épisode ${episode}`}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black hover:bg-gray-200"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Regarder
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2">Épisode {episode}</h3>
                    <p className="text-sm text-gray-400 mb-2">45 min</p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      Description de l'épisode {episode} de cette série captivante.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedTrailer(null);
        }}
        videoUrl={selectedTrailer ? `https://www.youtube.com/embed/${selectedTrailer}` : undefined}
        title={series.title}
      />
    </div>
  );
}