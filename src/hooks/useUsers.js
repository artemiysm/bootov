import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../api/users';

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 min — пользователи редко меняются
  });
};