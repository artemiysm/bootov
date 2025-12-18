import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import commentsReducer from './slices/commentsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});