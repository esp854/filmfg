import { db } from "./db";
import { movies, genres, movieGenres } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Insert genres first
    const insertedGenres = await db.insert(genres).values([
      { name: "Action", slug: "action" },
      { name: "Drame", slug: "drame" },
      { name: "Comédie", slug: "comedie" },
      { name: "Science-fiction", slug: "science-fiction" },
      { name: "Thriller", slug: "thriller" },
      { name: "Aventure", slug: "aventure" },
      { name: "Romance", slug: "romance" },
      { name: "Horreur", slug: "horreur" },
    ]).returning();

    console.log(`✅ Inserted ${insertedGenres.length} genres`);

    // Insert movies
    const insertedMovies = await db.insert(movies).values([
      {
        title: "Inception",
        description: "Un voleur spécialisé dans l'extraction de secrets des subconscients pendant le rêve se voit offrir une chance de retrouver sa vie d'avant, mais pour cela, il doit accomplir une tâche impossible : l'inception.",
        posterUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        year: 2010,
        duration: 148,
        rating: "8.8",
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page"],
        featured: true,
        trending: true,
      },
      {
        title: "The Dark Knight",
        description: "Batman affronte le Joker, un criminel anarchiste qui sème le chaos à Gotham City et force le Chevalier Noir à accepter l'une des épreuves psychologiques et physiques les plus difficiles de sa vie.",
        posterUrl: "https://images.unsplash.com/photo-1509347528160-9329522ecddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        year: 2008,
        duration: 152,
        rating: "9.0",
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Maggie Gyllenhaal"],
        featured: false,
        trending: true,
      },
      {
        title: "Pulp Fiction",
        description: "L'histoire de plusieurs criminels de Los Angeles dont les vies s'entremêlent de façon inattendue dans cette comédie noire culte de Quentin Tarantino.",
        posterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1489599808189-7c2d5c4d6a3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        year: 1994,
        duration: 154,
        rating: "8.9",
        director: "Quentin Tarantino",
        cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
        featured: false,
        trending: true,
      },
      {
        title: "Interstellar",
        description: "Dans un futur proche, la Terre se meurt. Un groupe d'explorateurs utilise un passage spatio-temporel fraîchement découvert pour surpasser les limites du voyage spatial et partir à la conquête des vastes distances impliquées dans un voyage interstellaire.",
        posterUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        year: 2014,
        duration: 169,
        rating: "8.6",
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Bill Irwin"],
        featured: false,
        trending: false,
      },
      {
        title: "The Matrix",
        description: "Un pirate informatique découvre que la réalité telle qu'il la connaît n'est qu'une simulation informatique contrôlée par une intelligence artificielle hostile.",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        year: 1999,
        duration: 136,
        rating: "8.7",
        director: "Lana et Lilly Wachowski",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
        featured: false,
        trending: false,
      },
      {
        title: "Parasite",
        description: "Une famille pauvre s'introduit progressivement dans la vie d'une famille riche, avec des conséquences inattendues et dramatiques.",
        posterUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        year: 2019,
        duration: 132,
        rating: "8.5",
        director: "Bong Joon-ho",
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
        featured: false,
        trending: true,
      }
    ]).returning();

    console.log(`✅ Inserted ${insertedMovies.length} movies`);

    // Create movie-genre relationships
    const movieGenreRelations = [
      { movieId: insertedMovies[0].id, genreId: insertedGenres.find(g => g.slug === "science-fiction")!.id }, // Inception - Sci-fi
      { movieId: insertedMovies[0].id, genreId: insertedGenres.find(g => g.slug === "action")!.id }, // Inception - Action
      { movieId: insertedMovies[0].id, genreId: insertedGenres.find(g => g.slug === "thriller")!.id }, // Inception - Thriller
      
      { movieId: insertedMovies[1].id, genreId: insertedGenres.find(g => g.slug === "action")!.id }, // Dark Knight - Action
      { movieId: insertedMovies[1].id, genreId: insertedGenres.find(g => g.slug === "thriller")!.id }, // Dark Knight - Thriller
      
      { movieId: insertedMovies[2].id, genreId: insertedGenres.find(g => g.slug === "action")!.id }, // Pulp Fiction - Action
      { movieId: insertedMovies[2].id, genreId: insertedGenres.find(g => g.slug === "drame")!.id }, // Pulp Fiction - Drame
      
      { movieId: insertedMovies[3].id, genreId: insertedGenres.find(g => g.slug === "science-fiction")!.id }, // Interstellar - Sci-fi
      { movieId: insertedMovies[3].id, genreId: insertedGenres.find(g => g.slug === "drame")!.id }, // Interstellar - Drame
      { movieId: insertedMovies[3].id, genreId: insertedGenres.find(g => g.slug === "aventure")!.id }, // Interstellar - Aventure
      
      { movieId: insertedMovies[4].id, genreId: insertedGenres.find(g => g.slug === "science-fiction")!.id }, // Matrix - Sci-fi
      { movieId: insertedMovies[4].id, genreId: insertedGenres.find(g => g.slug === "action")!.id }, // Matrix - Action
      
      { movieId: insertedMovies[5].id, genreId: insertedGenres.find(g => g.slug === "drame")!.id }, // Parasite - Drame
      { movieId: insertedMovies[5].id, genreId: insertedGenres.find(g => g.slug === "thriller")!.id }, // Parasite - Thriller
    ];

    await db.insert(movieGenres).values(movieGenreRelations);
    console.log(`✅ Inserted ${movieGenreRelations.length} movie-genre relations`);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedDatabase();