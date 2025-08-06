import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { MovieWithGenres } from "@/lib/types";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="bg-dark-card border-b border-gray-800 px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un film, une série..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-dark-bg border-gray-600 w-80 focus:border-netflix-red focus:ring-netflix-red pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-netflix-red rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">Jean Dupont</span>
          </div>
        </div>
      </div>
    </header>
  );
}
