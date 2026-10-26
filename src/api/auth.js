import { api } from './mockServer.js';

export const login = (email, password) =>
  api('/auth/login', { method: 'POST', body: { email, password } });

export const register = (payload) => api('/auth/register', { method: 'POST', body: payload });

export const me = () => api('/auth/me');
