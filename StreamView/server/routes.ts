import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertGenreSchema, insertWatchlistSchema } from "@shared/schema";
import { z } from "zod";
import { tmdbService } from "./tmdb-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Movie routes using TMDB
  app.get("/api/movies", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const data = await tmdbService.getPopularMovies(page);
      
      // Get detailed info for each movie with trailers
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 20).map(async (movie) => {
          try {
            const [details, credits, videos] = await Promise.all([
              tmdbService.getMovieDetails(movie.id),
              tmdbService.getMovieCredits(movie.id),
              tmdbService.getMovieVideos(movie.id)
            ]);
            return tmdbService.formatMovie(details, credits, videos);
          } catch (error) {
            return tmdbService.formatMovie(movie);
          }
        })
      );

      res.json(moviesWithDetails);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/featured", async (req, res) => {
    try {
      const data = await tmdbService.getTopRatedMovies(1);
      if (!data.results.length) {
        return res.status(404).json({ message: "No featured movie found" });
      }
      
      const featuredMovie = data.results[0];
      const [details, credits, videos] = await Promise.all([
        tmdbService.getMovieDetails(featuredMovie.id),
        tmdbService.getMovieCredits(featuredMovie.id),
        tmdbService.getMovieVideos(featuredMovie.id)
      ]);
      
      const formattedMovie = tmdbService.formatMovie(details, credits, videos);
      formattedMovie.featured = true;
      
      res.json(formattedMovie);
    } catch (error) {
      console.error("Failed to fetch featured movie:", error);
      res.status(500).json({ message: "Failed to fetch featured movie" });
    }
  });

  app.get("/api/movies/trending", async (req, res) => {
    try {
      const data = await tmdbService.getTrendingMovies();
      
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 10).map(async (movie) => {
          try {
            const [details, credits, videos] = await Promise.all([
              tmdbService.getMovieDetails(movie.id),
              tmdbService.getMovieCredits(movie.id),
              tmdbService.getMovieVideos(movie.id)
            ]);
            const formattedMovie = tmdbService.formatMovie(details, credits, videos);
            formattedMovie.trending = true;
            return formattedMovie;
          } catch (error) {
            const formattedMovie = tmdbService.formatMovie(movie);
            formattedMovie.trending = true;
            return formattedMovie;
          }
        })
      );

      res.json(moviesWithDetails);
    } catch (error) {
      console.error("Failed to fetch trending movies:", error);
      res.status(500).json({ message: "Failed to fetch trending movies" });
    }
  });

  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const data = await tmdbService.searchMovies(query);
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 10).map(async (movie) => {
          try {
            const [details, credits, videos] = await Promise.all([
              tmdbService.getMovieDetails(movie.id),
              tmdbService.getMovieCredits(movie.id),
              tmdbService.getMovieVideos(movie.id)
            ]);
            return tmdbService.formatMovie(details, credits, videos);
          } catch (error) {
            return tmdbService.formatMovie(movie);
          }
        })
      );
      
      res.json(moviesWithDetails);
    } catch (error) {
      console.error("Failed to search movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const [details, credits, videos] = await Promise.all([
        tmdbService.getMovieDetails(id),
        tmdbService.getMovieCredits(id),
        tmdbService.getMovieVideos(id)
      ]);
      
      const movie = tmdbService.formatMovie(details, credits, videos);
      res.json(movie);
    } catch (error) {
      console.error("Failed to fetch movie:", error);
      if (error.message.includes('404')) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // New route for detailed movie info with similar movies
  app.get("/api/movies/:id/details", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const [details, credits, videos, similar] = await Promise.all([
        tmdbService.getMovieDetails(id),
        tmdbService.getMovieCredits(id),
        tmdbService.getMovieVideos(id),
        tmdbService.getSimilarMovies(id)
      ]);
      
      const movie = tmdbService.formatMovie(details, credits, videos);
      const similarMovies = similar.results.slice(0, 10).map(similarMovie => 
        tmdbService.formatMovie(similarMovie)
      );
      
      res.json({
        movie,
        similarMovies,
        trailers: videos.results.filter(video => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
        ).map(video => ({
          key: video.key,
          name: video.name,
          type: video.type,
          url: `https://www.youtube.com/embed/${video.key}`
        }))
      });
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      if (error.message.includes('404')) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });

  app.post("/api/movies", async (req, res) => {
    try {
      const validatedData = insertMovieSchema.parse(req.body);
      const movie = await storage.createMovie(validatedData);
      res.status(201).json(movie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid movie data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create movie" });
    }
  });

  // Genre routes using TMDB
  app.get("/api/genres", async (req, res) => {
    try {
      const data = await tmdbService.getGenres();
      const formattedGenres = data.genres.map(genre => ({
        id: genre.id,
        name: genre.name,
        slug: genre.name.toLowerCase().replace(/\s+/g, '-')
      }));
      res.json(formattedGenres);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  app.get("/api/genres/:id/movies", async (req, res) => {
    try {
      const genreId = parseInt(req.params.id);
      if (isNaN(genreId)) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }
      
      const data = await tmdbService.getMoviesByGenre(genreId);
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 20).map(async (movie) => {
          try {
            const [details, credits, videos] = await Promise.all([
              tmdbService.getMovieDetails(movie.id),
              tmdbService.getMovieCredits(movie.id),
              tmdbService.getMovieVideos(movie.id)
            ]);
            return tmdbService.formatMovie(details, credits, videos);
          } catch (error) {
            return tmdbService.formatMovie(movie);
          }
        })
      );
      
      res.json(moviesWithDetails);
    } catch (error) {
      console.error("Failed to fetch movies by genre:", error);
      res.status(500).json({ message: "Failed to fetch movies by genre" });
    }
  });

  app.post("/api/genres", async (req, res) => {
    try {
      const validatedData = insertGenreSchema.parse(req.body);
      const genre = await storage.createGenre(validatedData);
      res.status(201).json(genre);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid genre data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create genre" });
    }
  });

  // Series routes (using movies data for now)
  app.get("/api/series", async (req, res) => {
    try {
      const data = await tmdbService.getTrendingMovies();
      
      const seriesWithDetails = await Promise.all(
        data.results.slice(0, 20).map(async (movie) => {
          try {
            const [details, credits, videos] = await Promise.all([
              tmdbService.getMovieDetails(movie.id),
              tmdbService.getMovieCredits(movie.id),
              tmdbService.getMovieVideos(movie.id)
            ]);
            const formattedSeries = tmdbService.formatMovie(details, credits, videos);
            formattedSeries.isSeries = true;
            return formattedSeries;
          } catch (error) {
            const formattedSeries = tmdbService.formatMovie(movie);
            formattedSeries.isSeries = true;
            return formattedSeries;
          }
        })
      );

      res.json(seriesWithDetails);
    } catch (error) {
      console.error("Failed to fetch series:", error);
      res.status(500).json({ message: "Failed to fetch series" });
    }
  });

  app.get("/api/series/:id/details", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid series ID" });
      }
      
      const [details, credits, videos] = await Promise.all([
        tmdbService.getMovieDetails(id),
        tmdbService.getMovieCredits(id),
        tmdbService.getMovieVideos(id)
      ]);
      
      const series = tmdbService.formatMovie(details, credits, videos);
      series.isSeries = true;
      
      const trailers = videos.results.filter(video => 
        video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser')
      ).map(video => ({
        key: video.key,
        name: video.name,
        type: video.type,
        url: `https://www.youtube.com/embed/${video.key}`
      }));
      
      res.json({
        series,
        trailers
      });
    } catch (error) {
      console.error("Failed to fetch series details:", error);
      if (error.message.includes('404')) {
        return res.status(404).json({ message: "Series not found" });
      }
      res.status(500).json({ message: "Failed to fetch series details" });
    }
  });

  // Watchlist routes
  app.get("/api/watchlist/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const watchlist = await storage.getUserWatchlist(userId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const validatedData = insertWatchlistSchema.parse(req.body);
      const entry = await storage.addToWatchlist(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid watchlist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:userId/:movieId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const movieId = parseInt(req.params.movieId);
      if (isNaN(userId) || isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid user ID or movie ID" });
      }
      await storage.removeFromWatchlist(userId, movieId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
