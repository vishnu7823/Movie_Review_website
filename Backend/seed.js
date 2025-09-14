// scripts/seed.js
require('dotenv').config({ path: './.env' });
const axios = require('axios');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');

const fetchMoviesFromOMDb = async (searchTerm, page) => {
  const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`;
  const { data } = await axios.get(url);
  if (data.Response === "True") {
    return data.Search;  // array of movie summaries
  } else {
    return [];  // no results
  }
};

const fetchDetailsFromOMDb = async (imdbID) => {
  const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbID}&plot=short`;
  const { data } = await axios.get(url);
  if (data.Response === "True") {
    return data;
  } else {
    return null;
  }
};

const seedMovies = async () => {
  try {
    await connectDB();
    await Movie.deleteMany();

    const searchTerms = ['love', 'war', 'life', 'adventure', 'action', 'comedy', 'drama']; 
    let moviesToInsert = [];

    for (let term of searchTerms) {
      for (let page = 1; page <= 5; page++) {  
        // e.g. 7 terms * 5 pages * ~10 results = 350 movies
        const results = await fetchMoviesFromOMDb(term, page);
        for (let item of results) {
          // fetch full details
          const detail = await fetchDetailsFromOMDb(item.imdbID);
          if (!detail) continue;
          // map to your schema
          moviesToInsert.push({
            title: detail.Title,
            description: detail.Plot,
            releaseYear: detail.Year ? parseInt(detail.Year.substring(0,4)) : null,
            genre: detail.Genre ? detail.Genre.split(',')[0].trim() : 'Unknown',
            posterUrl: detail.Poster !== "N/A" ? detail.Poster : '',
            rating: detail.imdbRating !== "N/A" ? parseFloat(detail.imdbRating) : 0
          });
        }
      }
    }

    // remove duplicates by title
    const uniqueMovies = Array.from(new Map(moviesToInsert.map(m => [m.title, m])).values());

    await Movie.insertMany(uniqueMovies);
    console.log(`✅ Inserted ${uniqueMovies.length} movies from OMDb`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding using OMDb:', err);
    process.exit(1);
  }
};

seedMovies();
