import axios from 'axios';

// Tipos (copiados del API.md)
export interface Game {
  id: number;
  name: string;
  category: string;
  recommendedPlayers: number;
  availableUnits: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

// URL de la API (en el examen: la de la hoja)
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Pone el token en cada pedido
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.url?.includes('/auth/')) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si llega 401: borra el token y va a /login
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Lee el code y el message de los errores
export function apiError(err: unknown) {
  if (axios.isAxiosError<{ code: string; message: string }>(err) && err.response) {
    return { code: err.response.data?.code, message: err.response.data?.message ?? 'Ocurrió un error.' };
  }
  return { code: undefined, message: 'No se pudo conectar con el servidor.' };
}