import { Movie } from './models/movie';

const request = require('supertest');
const server = require('./server');

describe('Post /movie', () => {
  const newMovieWithoutTitle = {
    year: 2022,
    runtime: 10,
    genres: ['Action'],
    director: 'Director'
  };

  const tooBigTitle = () => {
    let title = 'TooBigTitle';
    while (title.length <= 255) {
      title = title + title;
    }
    return title;
  };

  it('POST /movie with newMovie without title  ---> Error400 title is required', () => {
    return request(server)
      .post('/movie')
      .send(newMovieWithoutTitle)
      .expect(400)
      .then((response: any) => {
        console.log(response.error.text);
      });
  });

  it('POST /movie with newMovie with WRONGGENRE  ---> Error400 genre can accept only predefined genres', () => {
    return request(server)
      .post('/movie')
      .send({ ...newMovieWithoutTitle, genre: ['WRONGGENRE'] })
      .expect(400)
      .then((response: any) => {
        console.log(response.error.text);
      });
  });

  it('POST /movie with newMovie with too big title ---> Error400 title can accept only 255 characters', () => {
    return request(server)
      .post('/movie')
      .send({ ...newMovieWithoutTitle, title: tooBigTitle() })
      .expect(400)
      .then((response: any) => {
        console.log(response.error.text);
      });
  });

  it('POST /movie with newMovie that runtime is a string  ---> Error400 runtime can accept only numbers', () => {
    return request(server)
      .post('/movie')
      .send({ ...newMovieWithoutTitle, title: 'Title', runtime: 'Number' })
      .expect(400)
      .then((response: any) => {
        console.log(response.error.text);
      });
  });
});

describe('Get /movie', () => {
  it('GET /movie ---> array with one random movie', () => {
    return request(server)
      .get('/movie')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              title: expect.any(String)
            })
          ])
        );
      });
  });

  it('GET /movie?duration=110 ---> random movie with duration (+-10)110', () => {
    return request(server)
      .get('/movie?duration=110')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        expect(Number(response.body.runtime)).toBeGreaterThan(100);
        expect(Number(response.body.runtime)).toBeLessThan(120);
      });
  });

  it('GET /movie?duration=110&genres=Drama ---> all movies containing "Drama" genre with duration (+-10)110', () => {
    return request(server)
      .get('/movie?duration=110&genres=Drama')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        console.log(response.body);
        expect(
          response.body.every((movie: Movie) => {
            return Number(movie.runtime) >= 100 && Number(movie.runtime) <= 120 && movie.genres.includes('Drama');
          })
        ).toBe(true);
      });
  });

  it('GET /movie?genres=Drama ---> array with all movies containig "Drama" genre', () => {
    return request(server)
      .get('/movie?genres=Drama')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              title: expect.any(String)
            })
          ])
        );
        expect(
          response.body.every((movie: Movie) => {
            return movie.genres.includes('Drama');
          })
        ).toBe(true);
      });
  });
});
