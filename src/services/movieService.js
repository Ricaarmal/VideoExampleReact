import http from './httpService';
import { urlApi } from '../config.json';

const url = urlApi + '/movies';

function MovieUrl(id) {
  return `${url}/${id}`;
}

export function getMovies() {
  return http.get(url);
}

export function getMovie(movieId) {
  return http.get(MovieUrl(movieId));
}

export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie };
    delete body._id;
    return http.put(MovieUrl(movie._id), body);
  }

  return http.post(url, movie);
}

export function deleteMovies(movieId) {
  return http.delete(MovieUrl(movieId));
}
