import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Селекторы
export const selectPosts = (state) => state.posts.items;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;

export const selectCommentsByPostId = (postId) => (state) =>
  state.comments.byPostId[postId] || [];

export const selectCommentsLoading = (state) => state.comments.loading;
export const selectCommentsError = (state) => state.comments.error;