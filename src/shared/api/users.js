import api from './client';

export const getUserById = (id) => api.get(`/users/${id}`).then(res => res.data);