import { NextFunction, Request, Response } from 'express';
import { Movie } from '../models/movie';
import { uniqByName } from '../helpers/sort';
import { db } from '../server';
import logging from '../config/logging';

const NAMESPACE = 'GetMoviesByDuration';

const getMoviesByDuration = async (req: Request, res: Response, next: NextFunction) => {
  if (!('duration' in req.query)) {
    logging.error(NAMESPACE, 'Wrong query parameters. Valid parameters {duration: number, genres: string[]}');
    res.send('Wrong query parameters. Valid parameters {duration: number, genres: string[]}');
  }
  if (res.locals.moviesByGenres) {
    logging.info(NAMESPACE, `Send Movies by genres: ${res.locals.genres}. With duration: ${req.query.duration}`);
    res.send(
      res.locals.moviesByGenres.filter((movie: Movie) => {
        return Number(movie.runtime) > Number(req.query.duration) - 10 && Number(movie.runtime) < Number(req.query.duration) + 10;
      })
    );
  } else {
    const allByDuration = uniqByName(
      db.get('movies').filter((movie: Movie) => {
        return Number(movie.runtime) > Number(req.query.duration) - 10 && Number(movie.runtime) < Number(req.query.duration) + 10;
      })
    );
    logging.info(NAMESPACE, `Send random movie with duration: ${req.query.duration}`);
    res.send(allByDuration[Math.floor(Math.random() * allByDuration.length)]);
  }
};

export default getMoviesByDuration;
