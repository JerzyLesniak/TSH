import { NextFunction, Request, Response } from 'express';
import { db } from '../server';
import { Movie } from '../models/movie';
import { validationResult } from 'express-validator';
import logging from '../config/logging';

const NAMESPACE = 'MovieController';

const getMovies = (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.query).length !== 0) {
    next();
  } else {
    const movies = db.get('movies');
    const moviesCount = movies.length;
    res.send([movies[Math.floor(Math.random() * moviesCount)]]);
  }
};

const addNewMovie = (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    logging.info(NAMESPACE, `Genres validation errors: ${JSON.stringify(validationErrors)}`);
    res.status(400).json(validationErrors);
  } else {
    try {
      const allMovies = db.get('movies');
      const newId = allMovies.sort((a: Movie, b: Movie) => a.id - b.id)[allMovies.length - 1].id + 1;
      const newMovie = { ...req.body, id: newId };

      db.set('movies', [...allMovies, newMovie]);
      logging.info(NAMESPACE, `Successfully added new movie: ${JSON.stringify(newMovie)}`);
      res.send(`Successfully added new movie: ${JSON.stringify(newMovie)}`);
    } catch (e) {
      logging.error(NAMESPACE, e as string);
      res.status(500).json(e);
    }
  }
};

export default { getMovies, addNewMovie };
