import type { MovieWithGenres, Genre } from "@shared/schema";

export type { MovieWithGenres, Genre };

export interface SearchState {
  query: string;
  results: MovieWithGenres[];
  isLoading: boolean;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
}
