import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Play, Pause, Volume2, Maximize, Settings, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { MovieWithGenres } from "@/lib/types";

export default function WatchMovie() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: movie, isLoading } = useQuery<MovieWithGenres>({
    queryKey: ["/api/movies", id],
    enabled: !!id,
  });

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
    toast({
      title: isPlaying ? "⏸️ Pause" : "▶️ Lecture",
      description: isPlaying ? "Vidéo mise en pause" : "Lecture en cours",
    });
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    setShowControls(true);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
    setShowControls(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement du film...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Film non trouvé</h1>
          <Link href="/movies">
            <Button className="bg-netflix-red hover:bg-red-700">
              Retour aux films
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Player Area */}
      <div 
        className="relative w-full h-screen bg-black flex items-center justify-center cursor-pointer"
        onClick={() => setShowControls(!showControls)}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Simulated Video Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
        />
        
        {/* Play/Pause Button in Center */}
        {!isPlaying && (
          <Button
            onClick={togglePlay}
            size="lg"
            className="absolute z-20 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full p-8"
          >
            <Play className="w-12 h-12" />
          </Button>
        )}

        {/* Video Title Overlay */}
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-white text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-white/80 text-lg">En cours de lecture...</p>
        </div>

        {/* Controls Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-white/80 text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <Link href={`/movies/${id}`}>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              {/* Skip Backward */}
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="w-5 h-5" />
                <span className="ml-1 text-xs">10s</span>
              </Button>

              {/* Play/Pause */}
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              {/* Skip Forward */}
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="w-5 h-5" />
                <span className="ml-1 text-xs">10s</span>
              </Button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-white" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Settings */}
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>

              {/* Fullscreen */}
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Sidebar (when controls are visible) */}
      {showControls && (
        <Card className="absolute top-4 right-4 w-80 bg-black/80 border-gray-700 text-white">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-300 mb-3 line-clamp-3">
              {movie.description}
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>Année:</strong> {movie.year}</p>
              <p><strong>Note:</strong> ⭐ {movie.rating}/10</p>
              {movie.director && <p><strong>Réalisateur:</strong> {movie.director}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Episode/Movie Suggestion (Bottom Right) */}
      {showControls && (
        <Card className="absolute bottom-24 right-4 w-64 bg-black/80 border-gray-700 text-white">
          <CardContent className="p-3">
            <p className="text-xs text-gray-400 mb-2">À suivre</p>
            <div className="flex space-x-3">
              <img 
                src={movie.posterUrl} 
                alt="Suivant"
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">Films similaires</h4>
                <p className="text-xs text-gray-300">Découvrez d'autres films du même genre</p>
                <Link href="/movies">
                  <Button size="sm" className="mt-2 bg-netflix-red hover:bg-red-700 text-xs">
                    Explorer
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}