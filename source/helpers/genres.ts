import { CustomValidator } from 'express-validator';
import { genres } from '../data/db.json';

const normalizeGenres = (genres: any): string[] => {
  let normalized: string[] = [];

  ((Array.isArray(genres) ? genres : [genres]) as string[]).forEach((genre: string) => {
    const genreLowerCase = genre.toLowerCase();
    normalized.push(genreLowerCase.charAt(0).toUpperCase() + genreLowerCase.slice(1));
  });

  return normalized;
};

const validateGenres = (genresToValidate: string[]) => {
  genresToValidate.forEach((genre: string) => {
    if (genres.findIndex((validGenere: string) => validGenere.toLowerCase() === genre.toLowerCase()) === -1)
      throw new Error('Wrong genere.');
  });
};

const postGenresValidation: CustomValidator = (genresToValidate: string[]) => {
  return genresToValidate && Array.isArray(genresToValidate)
    ? genresToValidate.every(
        (genre: string) => genres.findIndex((validGenere: string) => validGenere.toLowerCase() === genre.toLowerCase()) > -1
      )
    : false;
};

export { normalizeGenres, validateGenres, postGenresValidation };
