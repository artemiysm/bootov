import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../api/users';

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['users', userId],       // ['users', 1], ['users', 2] — отдельный кэш
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,                 // Не грузить, если userId = 0/null/undefined
    staleTime: 5 * 60 * 1000,          // Пользователи редко меняются → кэш на 5 мин
  });
};