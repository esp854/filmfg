interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genre_ids: number[];
  genres?: Array<{ id: number; name: string }>;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBCredits {
  cast: Array<{
    name: string;
    character: string;
    known_for_department: string;
  }>;
  crew: Array<{
    name: string;
    job: string;
    department: string;
  }>;
}

class TMDBService {
  private apiKey: string;
  private baseUrl = 'https://api.themoviedb.org/3';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  private backdropBaseUrl = 'https://image.tmdb.org/t/p/w1280';

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('TMDB_API_KEY is required');
    }
  }

  private async fetchFromTMDB(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}api_key=${this.apiKey}`);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPopularMovies(page = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    return this.fetchFromTMDB(`/movie/popular?page=${page}&language=fr-FR`);
  }

  async getTrendingMovies(): Promise<{ results: TMDBMovie[] }> {
    return this.fetchFromTMDB('/trending/movie/week?language=fr-FR');
  }

  async getTopRatedMovies(page = 1): Promise<{ results: TMDBMovie[] }> {
    return this.fetchFromTMDB(`/movie/top_rated?page=${page}&language=fr-FR`);
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    return this.fetchFromTMDB(`/movie/${movieId}?language=fr-FR`);
  }

  async getMovieCredits(movieId: number): Promise<TMDBCredits> {
    return this.fetchFromTMDB(`/movie/${movieId}/credits`);
  }

  async getMovieVideos(movieId: number): Promise<{ results: Array<{ key: string; site: string; type: string; name: string; official: boolean }> }> {
    return this.fetchFromTMDB(`/movie/${movieId}/videos?language=fr-FR`);
  }

  async getMovieImages(movieId: number): Promise<{ backdrops: Array<{ file_path: string }> }> {
    return this.fetchFromTMDB(`/movie/${movieId}/images`);
  }

  async getSimilarMovies(movieId: number): Promise<{ results: TMDBMovie[] }> {
    return this.fetchFromTMDB(`/movie/${movieId}/similar?language=fr-FR`);
  }

  async searchMovies(query: string, page = 1): Promise<{ results: TMDBMovie[] }> {
    return this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=fr-FR`);
  }

  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB('/genre/movie/list?language=fr-FR');
  }

  async getMoviesByGenre(genreId: number, page = 1): Promise<{ results: TMDBMovie[] }> {
    return this.fetchFromTMDB(`/discover/movie?with_genres=${genreId}&page=${page}&language=fr-FR`);
  }

  getImageUrl(path: string): string {
    return path ? `${this.imageBaseUrl}${path}` : '';
  }

  getBackdropUrl(path: string): string {
    return path ? `${this.backdropBaseUrl}${path}` : '';
  }

  // Convert TMDB movie to our format
  formatMovie(tmdbMovie: TMDBMovie, credits?: TMDBCredits, videos?: { results: Array<{ key: string; site: string; type: string; name: string; official: boolean }> }): any {
    const director = credits?.crew.find(person => person.job === 'Director')?.name || 'Inconnu';
    const cast = credits?.cast.slice(0, 10).map(actor => actor.name) || [];
    
    // Find the best trailer (official YouTube trailer preferred)
    const trailer = videos?.results.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' && 
      video.official
    ) || videos?.results.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer'
    );

    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      description: tmdbMovie.overview || 'Description non disponible',
      posterUrl: this.getImageUrl(tmdbMovie.poster_path),
      backdropUrl: this.getBackdropUrl(tmdbMovie.backdrop_path),
      videoUrl: trailerUrl,
      year: new Date(tmdbMovie.release_date).getFullYear(),
      duration: tmdbMovie.runtime || 120,
      rating: tmdbMovie.vote_average.toFixed(1),
      director,
      cast,
      featured: false,
      trending: false,
      createdAt: new Date(),
      genres: tmdbMovie.genres?.map(genre => ({
        id: genre.id,
        name: genre.name,
        slug: genre.name.toLowerCase().replace(/\s+/g, '-')
      })) || [],
      trailers: videos?.results.filter(video => 
        video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser')
      ).map(video => ({
        key: video.key,
        name: video.name,
        type: video.type,
        url: `https://www.youtube.com/embed/${video.key}`
      })) || []
    };
  }
}

export const tmdbService = new TMDBService();