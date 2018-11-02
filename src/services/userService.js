import http from './httpService';
import { urlApi } from '../config.json';

const url = urlApi + '/users';

export function Register(user) {
  return http.post(url, {
    email: user.username,
    password: user.password,
    name: user.name
  });
}
