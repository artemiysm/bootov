// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // ← убраны пробелы!
});

// Чистые функции (возвращают Promise, не вызывают setState)
export const getPosts = () => api.get('/posts').then(res => res.data.slice(0, 10));

export const getPost = (id) => api.get(`/posts/${id}`).then(res => res.data);

export const createPost = (post) => 
  api.post('/posts', post).then(res => res.data);

export const updatePost = (id, data) => 
  api.put(`/posts/${id}`, data).then(res => res.data);

export const deletePost = (id) => 
  api.delete(`/posts/${id}`).then(() => id); // для оптимистичного удаления

// Комментарии
export const getCommentsByPostId = (postId) => 
  api.get(`/posts/${postId}/comments`).then(res => res.data);

export const createComment = (comment) => 
  api.post('/comments', comment).then(res => res.data);