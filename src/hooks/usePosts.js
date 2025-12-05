// src/hooks/usePosts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost } from '../api/api';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 5 * 60 * 1000, // 5 мин
    retry: 2,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const tempId = Date.now();
      const optimisticPost = { id: tempId, ...newPost };
      queryClient.setQueryData(['posts'], (old) => [optimisticPost, ...(old || []).slice(0, 9)]);
      return { tempId };
    },
    onSuccess: (realPost, newPost, context) => {
      queryClient.setQueryData(['posts'], (old) =>
        old.map(p => p.id === context.tempId ? realPost : p)
      );
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], (old) =>
        old.filter(p => p.id !== context.tempId)
      );
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePost(id, data),
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
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) => old?.filter(p => p.id !== id) || []);
      return { previousPosts };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
  });
};