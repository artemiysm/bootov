// src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные "свежие" 5 минут, кэш живёт 10 минут
      staleTime: 5 * 60 * 1000, // 5 min
      cacheTime: 10 * 60 * 1000, // 10 min
      retry: 2, // повторить 2 раза при ошибке
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;