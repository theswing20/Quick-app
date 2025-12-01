import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import { useMemo } from 'react';

export const useApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://serriform-noncleistogamic-olen.ngrok-free.dev/api',
      timeout: 30_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken({ template: 'default' });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return api;
};
