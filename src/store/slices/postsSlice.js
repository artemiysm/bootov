import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPosts, createPost, updatePost, deletePost } from '../../api/api';

const initialState = {
  items: [],
  loading: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', () => getPosts());

export const addPost = createAsyncThunk('posts/addPost', (post) => createPost(post));

export const editPost = createAsyncThunk('posts/editPost', ({ id, data }) =>
  updatePost(id, data)
);

export const removePost = createAsyncThunk('posts/removePost', (id) => {
  return deletePost(id).then(() => id);
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = 'idle';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.error.message || 'Failed to load posts';
      })

      // addPost — оптимистично
      .addCase(addPost.pending, (state, action) => {
        const tempPost = { id: Date.now(), userId: 1, ...action.meta.arg };
        state.items.unshift(tempPost);
      })
      .addCase(addPost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.meta.arg.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.meta.arg.id);
      })

      // editPost — оптимистично
      .addCase(editPost.pending, (state, action) => {
        const { id, data } = action.meta.arg;
        const post = state.items.find((p) => p.id === id);
        if (post) Object.assign(post, data);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // removePost
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;