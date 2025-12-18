// src/features/post-comments/model/hooks.js
import { useDispatch, useSelector } from 'react-redux';

export const useComments = (postId) => {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments.byPostId[postId] || []);
  const loading = useSelector(state => state.comments.loading);
  const error = useSelector(state => state.comments.error);

  return { comments, loading, error, dispatch };
};