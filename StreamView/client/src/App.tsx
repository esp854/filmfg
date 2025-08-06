import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Movies from "@/pages/movies";
import MovieDetail from "@/pages/movie-detail";
import Series from "@/pages/series";
import SeriesDetail from "@/pages/series-detail";
import WatchMovie from "@/pages/watch-movie";
import Genres from "@/pages/genres";
import History from "@/pages/history";
import Watchlist from "@/pages/watchlist";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-dark-bg text-white dark">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-60">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/movies" component={Movies} />
            <Route path="/movies/:id" component={MovieDetail} />
            <Route path="/watch/:id" component={WatchMovie} />
            <Route path="/series" component={Series} />
            <Route path="/series/:id" component={SeriesDetail} />
            <Route path="/genres" component={Genres} />
            <Route path="/watchlist" component={Watchlist} />
            <Route path="/history" component={History} />
            <Route path="/profile" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Mon Profil (À venir)</h1></div>} />
            <Route path="/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Paramètres (À venir)</h1></div>} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
