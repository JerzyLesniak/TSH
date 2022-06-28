# Movies API

THS Code Challenge

## Project Directory Structure

```
├── src
│   ├── config
│   │   ├── config.ts
│   │   └── logging.ts
│   ├── controllers
│   │   └── movie.ts
│   ├── data
│   │   └── db.json
│   ├── helpers
│   │   ├── genres.ts
│   │   └── sort.ts
│   ├── middleware
│   │   ├── getMoviesByDuration.ts
│   │   └── getMoviesByGenres.ts
│   ├── models
│   │   └── movie.ts
│   ├── routes
│   │   └── movie.ts
│   ├── server.ts
│   └── server.test.ts
```

## Requirements

For development, you will need node global package, installed in your environement. Install all dependencies using:

`$npm install`

## Running the project

`$nodemon source\server.ts`

## Running tests

`$npm run test`

## API Endpoints

GET:

- /movie - Get random movie
- /movie?duration=YOUR_DURATION - Get random movie with duration. (+-10 YOUR_DURATION(Int))
- /movie?genres=GENRE_ONE&genres=GENRE_TWO - Get all movies with genres (Array of genres(max3))
- /movie?duration=YOUR_DURATION&genres=GENRE_ONE&genres=GENRE_TWO - Get all movies with genres filtered by duration (Array of genres(max3),
  YOUR_DURATION(Int)+-10)

POST:

- /movie - Post (in request body) new movie you want to save in database

## Endpoints Validation

Valid Genres: "Comedy", "Fantasy", "Crime", "Drama", "Music", "Adventure", "History", "Thriller", "Animation", "Family", "Mystery",
"Biography", "Action", "Film-Noir", "Romance", "Sci-Fi", "War", "Western", "Horror", "Musical", "Sport"

Valid new movie:

- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)
