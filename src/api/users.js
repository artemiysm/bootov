import api from './client';

// GET /users/1 — загрузить пользователя по ID
// Нужно, например, чтобы показать имя автора поста (post.userId → user.name)
export const getUserById = (id) => {
  return api.get(`/users/${id}`).then(res => res.data);
};