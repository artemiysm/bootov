import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as postsApi from '../api/postsApi';

// Получение списка постов
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getPosts,
  });
};

// Получение поста по ID (для dependent queries)
export const usePostById = (id) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id, // запрос только если id truthy
    staleTime: 60 * 1000, // 1 min
  });
};

// Создание поста
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.createPost,
    // Оптимистичное обновление
    onMutate: async (newPost) => {
      // Отменяем исходящие refetch'и
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Снимаем текущий кэш
      const previousPosts = queryClient.getQueryData(['posts']);

      // Оптимистично добавляем новый пост в начало списка
      queryClient.setQueryData(['posts'], (old) => [
        { id: 'temp-' + Date.now(), ...newPost },
        ...(old || []),
      ]);

      // Возвращаем контекст для отката
      return { previousPosts };
    },
    // При ошибке — откат
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
      console.error('Ошибка создания поста:', err);
    },
    // При успехе — обноволяем кэш (или можно обновить напрямую)
    onSuccess: (newPost) => {
      queryClient.setQueryData(['posts'], (old) =>
        old.map(post => post.id?.toString().startsWith('temp-') && !post.id2 ? { ...post, id: newPost.id, id2: true } : post)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Обновление поста
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) =>
        old.map(post => (post.id === id ? { ...post, ...data } : post))
      );
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Удаление поста
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) => old.filter(post => post.id !== id));
      return { previousPosts, id };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};