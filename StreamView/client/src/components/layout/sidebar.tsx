import { Link, useLocation } from "wouter";
import { Play, Home, Film, Tv, LayersIcon, Bookmark, History, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Films", href: "/movies", icon: Film },
    { name: "Séries", href: "/series", icon: Tv },
    { name: "Genres", href: "/genres", icon: LayersIcon },
    { name: "Ma Liste", href: "/watchlist", icon: Bookmark },
    { name: "Historique", href: "/history", icon: History },
  ];

  const accountNavigation = [
    { name: "Mon Profil", href: "/profile", icon: User },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-dark-card border-r border-gray-800 z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-netflix-red rounded mr-3 flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold">StreamFlix</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                    isActive
                      ? "text-white bg-netflix-red"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Account Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          {accountNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                    isActive
                      ? "text-white bg-netflix-red"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
