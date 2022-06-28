import { NextFunction, Request, Response } from 'express';
import { db } from '../server';
import { Movie } from '../models/movie';
import { sortMovies, uniqByName } from '../helpers/sort';
import { normalizeGenres, validateGenres } from '../helpers/genres';
import logging from '../config/logging';

const NAMESPACE = 'GetMoviesByGenres';

const filterDbMoviesByGenres = (genres: string[]): Movie[] => {
  return sortMovies(
    uniqByName(db.get('movies').filter((movie: Movie) => genres.some((elem: string) => movie.genres.includes(elem)))),
    genres
  );
};

const getMoviesByGenres = async (req: Request, res: Response, next: NextFunction) => {
  if ('genres' in req.query) {
    res.locals.genres = normalizeGenres(req.query.genres);
    try {
      validateGenres(res.locals.genres);
      const filteredByGenres = filterDbMoviesByGenres(res.locals.genres);
      if ('duration' in req.query) {
        res.locals.moviesByGenres = filteredByGenres;
        next();
      } else {
        logging.info(NAMESPACE, `Send movies with genres: ${res.locals.genres}`);
        res.send(filteredByGenres);
      }
    } catch (e) {
      logging.error(NAMESPACE, e as string);
      res.status(400).json({
        message: `${e} Valid Generes: ${db.get('genres')}`
      });
    }
  } else {
    next();
  }
};

export default getMoviesByGenres;
