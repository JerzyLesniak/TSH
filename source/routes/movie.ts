import express from 'express';
import { body } from 'express-validator';
import controller from '../controllers/movie';
import getMoviesByGenres from '../middleware/getMoviesByGenres';
import getMoviesByDuration from '../middleware/getMoviesByDuration';
import { postGenresValidation } from '../helpers/genres';
import { db } from '../server';

const genres = db.get('genres');
const router = express.Router();

router
  .route('/movie')
  .get(controller.getMovies, getMoviesByGenres, getMoviesByDuration)
  .post(
    body('title', 'title required (string, max 255 chars)').isString().isLength({ max: 255 }),
    body('year', 'year required (number)').isInt(),
    body('director', 'director required (string, max 255 chars)').isString().isLength({ max: 255 }),
    body('runtime', 'runtime required (number)').isNumeric(),
    body('genres', `genres required (array of accepted genres: ${genres})`).custom(postGenresValidation),
    body('actors', `actors (string)`).optional().isString(),
    body('plot', `plot (string)`).optional().isString(),
    body('posterUrl', `posterUrl (string)`).optional().isString(),
    controller.addNewMovie
  );

export = router;
