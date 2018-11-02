import http from './httpService';
import { urlApi } from '../config.json';

const newApi = urlApi + '/auth';

export function login(email, password) {
  return http.post(newApi, { email, password });
}
