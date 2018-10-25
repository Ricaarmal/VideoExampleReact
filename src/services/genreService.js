import http from './httpService';
import { urlApi } from '../config.json';

export function getGenres() {
  return http.get(urlApi + '/genres');
}
