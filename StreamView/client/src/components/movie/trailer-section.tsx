import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Trailer {
  key: string;
  name: string;
  type: string;
  url: string;
}

interface TrailerSectionProps {
  trailers: Trailer[];
  movieTitle: string;
}

export default function TrailerSection({ trailers, movieTitle }: TrailerSectionProps) {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  if (!trailers || trailers.length === 0) {
    return null;
  }

  const handleTrailerClick = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedTrailer(null);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Bandes-annonces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trailers.map((trailer) => (
            <div
              key={trailer.key}
              className="relative group cursor-pointer rounded-lg overflow-hidden bg-dark-card border border-gray-700 hover:border-netflix-red transition-colors"
              onClick={() => handleTrailerClick(trailer)}
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                  alt={trailer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white truncate">{trailer.name}</h4>
                <p className="text-sm text-gray-400">{trailer.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={closePlayer}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
          <div className="sr-only">
            <h2>Bande-annonce de {movieTitle}</h2>
            <p>Lecteur vidéo pour la bande-annonce du film</p>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={closePlayer}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {selectedTrailer && (
              <div className="aspect-video">
                <iframe
                  src={`${selectedTrailer.url}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedTrailer.name}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            
            {selectedTrailer && (
              <div className="p-6 bg-dark-card">
                <h3 className="text-xl font-bold text-white mb-2">{selectedTrailer.name}</h3>
                <p className="text-gray-300">
                  {selectedTrailer.type} - {movieTitle}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}