import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// GET: получить посты (ограничим 10 для удобства)
export const fetchPosts = () => {
  return api.get('/posts').then(res => res.data.slice(0, 10));
};

// POST: создать пост
export const createPost = (post) => {
  return api.post('/posts', post).then(res => res.data);
};

// PUT: обновить пост
export const updatePost = (id, updatedPost) => {
  return api.put(`/posts/${id}`, updatedPost).then(res => res.data);
};

// DELETE: удалить пост
export const deletePost = (id) => {
  return api.delete(`/posts/${id}`).then(() => {});
};