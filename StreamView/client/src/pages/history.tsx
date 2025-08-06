import { useState } from "react";
import { Clock, Trash2, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// Données d'exemple pour l'historique
const mockHistory = [
  {
    id: 278,
    title: "Les Évadés",
    posterUrl: "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
    watchedAt: new Date("2024-01-20T20:30:00"),
    progress: 95,
    duration: 142,
    genre: "Drame"
  },
  {
    id: 238,
    title: "Le Parrain",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    watchedAt: new Date("2024-01-19T19:15:00"),
    progress: 78,
    duration: 175,
    genre: "Crime"
  },
  {
    id: 424,
    title: "La Liste de Schindler",
    posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    watchedAt: new Date("2024-01-18T21:00:00"),
    progress: 100,
    duration: 195,
    genre: "Drame"
  },
  {
    id: 680,
    title: "Pulp Fiction",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    watchedAt: new Date("2024-01-17T22:45:00"),
    progress: 45,
    duration: 154,
    genre: "Crime"
  },
  {
    id: 13,
    title: "Forrest Gump",
    posterUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    watchedAt: new Date("2024-01-16T20:00:00"),
    progress: 100,
    duration: 142,
    genre: "Drame"
  }
];

export default function History() {
  const [history, setHistory] = useState(mockHistory);
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all");

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const removeFromHistory = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  const filteredHistory = history.filter(item => {
    if (filter === "completed") return item.progress === 100;
    if (filter === "in-progress") return item.progress < 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold flex items-center">
            <Clock className="w-8 h-8 mr-3" />
            Historique de visionnage
          </h1>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllHistory}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout effacer
            </Button>
          )}
        </div>
        <p className="text-gray-400 text-lg">
          Retrouvez tous les films que vous avez regardés
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-netflix-red" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
        >
          Tous ({history.length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "bg-netflix-red" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
        >
          Terminés ({history.filter(item => item.progress === 100).length})
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          onClick={() => setFilter("in-progress")}
          className={filter === "in-progress" ? "bg-netflix-red" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
        >
          En cours ({history.filter(item => item.progress < 100).length})
        </Button>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-4">
            {filter === "all" ? "Aucun historique" : `Aucun film ${filter === "completed" ? "terminé" : "en cours"}`}
          </h3>
          <p className="text-gray-400 mb-6">
            {filter === "all" 
              ? "Commencez à regarder des films pour voir votre historique ici"
              : "Changez de filtre pour voir d'autres films"
            }
          </p>
          <Link href="/">
            <Button className="bg-netflix-red hover:bg-red-700">
              Découvrir des films
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="bg-dark-card border-gray-700 hover:border-netflix-red transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromHistory(item.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <Badge variant="secondary" className="bg-gray-700">
                        {item.genre}
                      </Badge>
                      <span>{formatDuration(item.duration)}</span>
                      <span>Regardé le {formatDate(item.watchedAt)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                        <span>Progression</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link href={`/movies/${item.id}`}>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                          <Play className="w-4 h-4 mr-2" />
                          {item.progress === 100 ? "Revoir" : "Continuer"}
                        </Button>
                      </Link>
                      <Link href={`/movies/${item.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}