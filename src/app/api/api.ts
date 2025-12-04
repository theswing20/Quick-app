import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect, useMemo, useRef } from 'react';

export const useApi = () => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);

  // Обновляем ref при изменении getToken, но не пересоздаем axios instance
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://serriform-noncleistogamic-olen.ngrok-free.dev/api',
      timeout: 30_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(async (config) => {
      // Используем ref для получения актуального getToken без пересоздания instance
      const token = await getTokenRef.current();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, []); // Убрали getToken из зависимостей - instance создается только один раз

  return api;
};
