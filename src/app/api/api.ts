// api.js
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

export const useApi = () => {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: 'https://serriform-noncleistogamic-olen.ngrok-free.dev/api',
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken({ template: 'default' });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};
