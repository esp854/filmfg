import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  posterUrl: text("poster_url").notNull(),
  backdropUrl: text("backdrop_url").notNull(),
  videoUrl: text("video_url"),
  year: integer("year").notNull(),
  duration: integer("duration").notNull(), // in minutes
  rating: text("rating").notNull(), // IMDb rating as string
  director: text("director").notNull(),
  cast: json("cast").$type<string[]>().notNull(),
  featured: boolean("featured").default(false).notNull(),
  trending: boolean("trending").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  genreId: integer("genre_id").references(() => genres.id).notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Relations
export const moviesRelations = relations(movies, ({ many }) => ({
  movieGenres: many(movieGenres),
  watchlistEntries: many(watchlist),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  watchlistEntries: many(watchlist),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [watchlist.movieId],
    references: [movies.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
});

export const insertMovieGenreSchema = createInsertSchema(movieGenres).omit({
  id: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  addedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Genre = typeof genres.$inferSelect;
export type InsertGenre = z.infer<typeof insertGenreSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type MovieGenre = typeof movieGenres.$inferSelect;
export type InsertMovieGenre = z.infer<typeof insertMovieGenreSchema>;

export type WatchlistEntry = typeof watchlist.$inferSelect;
export type InsertWatchlistEntry = z.infer<typeof insertWatchlistSchema>;

// Extended types with relations
export type MovieWithGenres = Movie & {
  genres: Genre[];
};
