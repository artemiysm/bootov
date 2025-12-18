import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/post-list/model/slice';
import commentsReducer from '../features/post-comments/model/slice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
  },
});