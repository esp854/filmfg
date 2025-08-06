import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  trailers?: Array<{
    key: string;
    name: string;
    type: string;
    url: string;
  }>;
}

export default function VideoPlayer({ isOpen, onClose, videoUrl, title, trailers }: VideoPlayerProps) {
  if (!isOpen) return null;

  // Determine which video to play
  let playUrl = videoUrl;
  if (!playUrl && trailers && trailers.length > 0) {
    playUrl = trailers[0].url;
  }

  if (!playUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-full p-6 bg-dark-card border border-gray-700">
          <div className="sr-only">
            <h2>Lecteur vidéo</h2>
            <p>Aucune vidéo disponible</p>
          </div>
          <div className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">Aucune vidéo disponible</h3>
            <p className="text-gray-400 mb-6">
              Désolé, aucune bande-annonce n'est disponible pour ce film.
            </p>
            <Button onClick={onClose} className="bg-netflix-red hover:bg-red-700">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 bg-black border-0">
        <div className="sr-only">
          <h2>Bande-annonce de {title}</h2>
          <p>Lecteur vidéo pour la bande-annonce</p>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="aspect-video">
            <iframe
              src={`${playUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={title || "Bande-annonce"}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {title && (
            <div className="p-6 bg-dark-card">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-300">Bande-annonce officielle</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}