// src/features/post-list/model/hooks.js
import { useDispatch, useSelector } from 'react-redux';

export const usePosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.items);
  const loading = useSelector(state => state.posts.loading);
  const error = useSelector(state => state.posts.error);

  return { posts, loading, error, dispatch };
};