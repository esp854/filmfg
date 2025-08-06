import { movies, genres, movieGenres, watchlist, users, type Movie, type InsertMovie, type Genre, type InsertGenre, type MovieWithGenres, type User, type InsertUser, type WatchlistEntry, type InsertWatchlistEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Movie methods
  getMovies(): Promise<MovieWithGenres[]>;
  getFeaturedMovie(): Promise<MovieWithGenres | undefined>;
  getTrendingMovies(): Promise<MovieWithGenres[]>;
  getMoviesByGenre(genreSlug: string): Promise<MovieWithGenres[]>;
  getMovie(id: number): Promise<MovieWithGenres | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  searchMovies(query: string): Promise<MovieWithGenres[]>;

  // Genre methods
  getGenres(): Promise<Genre[]>;
  createGenre(genre: InsertGenre): Promise<Genre>;

  // Watchlist methods
  addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry>;
  removeFromWatchlist(userId: number, movieId: number): Promise<void>;
  getUserWatchlist(userId: number): Promise<MovieWithGenres[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMovies(): Promise<MovieWithGenres[]> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .orderBy(desc(movies.createdAt));

    return this.groupMoviesWithGenres(result);
  }

  async getFeaturedMovie(): Promise<MovieWithGenres | undefined> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(eq(movies.featured, true))
      .limit(1);

    const grouped = this.groupMoviesWithGenres(result);
    return grouped[0] || undefined;
  }

  async getTrendingMovies(): Promise<MovieWithGenres[]> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(eq(movies.trending, true))
      .orderBy(desc(movies.createdAt));

    return this.groupMoviesWithGenres(result);
  }

  async getMoviesByGenre(genreSlug: string): Promise<MovieWithGenres[]> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(eq(genres.slug, genreSlug))
      .orderBy(desc(movies.createdAt));

    return this.groupMoviesWithGenres(result);
  }

  async getMovie(id: number): Promise<MovieWithGenres | undefined> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(eq(movies.id, id));

    const grouped = this.groupMoviesWithGenres(result);
    return grouped[0] || undefined;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db
      .insert(movies)
      .values(insertMovie)
      .returning();
    return movie;
  }

  async searchMovies(query: string): Promise<MovieWithGenres[]> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(movies)
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(sql`${movies.title} ILIKE ${`%${query}%`}`)
      .orderBy(desc(movies.createdAt));

    return this.groupMoviesWithGenres(result);
  }

  async getGenres(): Promise<Genre[]> {
    return await db.select().from(genres).orderBy(genres.name);
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const [genre] = await db
      .insert(genres)
      .values(insertGenre)
      .returning();
    return genre;
  }

  async addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry> {
    const [watchlistEntry] = await db
      .insert(watchlist)
      .values(entry)
      .returning();
    return watchlistEntry;
  }

  async removeFromWatchlist(userId: number, movieId: number): Promise<void> {
    await db
      .delete(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));
  }

  async getUserWatchlist(userId: number): Promise<MovieWithGenres[]> {
    const result = await db
      .select({
        movie: movies,
        genre: genres,
      })
      .from(watchlist)
      .innerJoin(movies, eq(watchlist.movieId, movies.id))
      .leftJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      .leftJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(eq(watchlist.userId, userId))
      .orderBy(desc(watchlist.addedAt));

    return this.groupMoviesWithGenres(result);
  }

  private groupMoviesWithGenres(result: Array<{ movie: Movie; genre: Genre | null }>): MovieWithGenres[] {
    const movieMap = new Map<number, MovieWithGenres>();

    for (const row of result) {
      if (!movieMap.has(row.movie.id)) {
        movieMap.set(row.movie.id, {
          ...row.movie,
          genres: [],
        });
      }

      if (row.genre) {
        const movie = movieMap.get(row.movie.id)!;
        if (!movie.genres.some(g => g.id === row.genre!.id)) {
          movie.genres.push(row.genre);
        }
      }
    }

    return Array.from(movieMap.values());
  }
}

export const storage = new DatabaseStorage();
