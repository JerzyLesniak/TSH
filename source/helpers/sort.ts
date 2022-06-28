import { isEqual, difference, uniqBy } from 'lodash';
import { Movie } from '../models/movie';

const sortByLessGenres = (a: Movie, b: Movie) => {
  if (a.genres.length < b.genres.length) return -1;
  if (a.genres.length > b.genres.length) return 1;
  return 0;
};

const sortFilteredMovies = (genres: string[]) => {
  switch (genres.length) {
    case 3:
      return (a: Movie, b: Movie) => {
        if (a.genres.includes(genres[0]) && !b.genres.includes(genres[0])) return -1;
        if (a.genres.includes(genres[1]) && b.genres.includes(genres[2])) return -1;
        if (a.genres.includes(genres[2]) && !b.genres.includes(genres[2])) return 1;
        return 0;
      };
    case 2:
      return (a: Movie, b: Movie) => {
        if (a.genres.includes(genres[0]) && !b.genres.includes(genres[0])) return -1;
        if (a.genres.includes(genres[1]) && !b.genres.includes(genres[1])) return 1;
        return 0;
      };
    case 1:
      return sortByLessGenres;
  }
};

const sortMovies = (filteredMovies: Movie[], genres: string[]) => {
  let topPicks = filteredMovies.filter((movie: Movie) => {
    return isEqual(movie.genres.sort(), [...genres].sort());
  });
  filteredMovies = difference(filteredMovies, topPicks);

  if (genres.length === 3) {
    let secondPicks = [
      ...filteredMovies
        .filter((movie: Movie) => {
          return movie.genres.includes(genres[0]) && movie.genres.includes(genres[1]);
        })
        .sort(sortByLessGenres),
      ...filteredMovies
        .filter((movie: Movie) => {
          return movie.genres.includes(genres[0]) && movie.genres.includes(genres[2]);
        })
        .sort(sortByLessGenres),
      ...filteredMovies
        .filter((movie: Movie) => {
          return movie.genres.includes(genres[1]) && movie.genres.includes(genres[2]);
        })
        .sort(sortByLessGenres)
    ];
    topPicks = [...topPicks, ...secondPicks];
    filteredMovies = difference(filteredMovies, secondPicks);
  }

  filteredMovies.sort(sortFilteredMovies(genres));

  return [...topPicks, ...filteredMovies];
};

const uniqByName = (arr: Movie[]): Movie[] => {
  return uniqBy(arr, (e: Movie) => e.title);
};

export { uniqByName, sortFilteredMovies, sortByLessGenres, sortMovies };
