import { getCommentsByPostId, createComment } from '../../../shared/api/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
  byPostId: {},
  loading: 'idle',
  error: null,
};

export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchByPostId',
  async (postId) => {
    const data = await getCommentsByPostId(postId);
    return { postId, data };
  }
);

export const addComment = createAsyncThunk('comments/addComment', (comment) =>
  createComment(comment)
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        state.byPostId[postId] = data;
        state.loading = 'idle';
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.error.message || 'Failed to load comments';
      })

      // addComment — оптимистично
      .addCase(addComment.pending, (state, action) => {
        const tempComment = { id: Date.now(), ...action.meta.arg };
        const postId = action.meta.arg.postId;
        if (!state.byPostId[postId]) state.byPostId[postId] = [];
        state.byPostId[postId].unshift(tempComment);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const postId = action.meta.arg.postId;
        const comments = state.byPostId[postId];
        if (!comments) return;
        const idx = comments.findIndex((c) => c.id === action.meta.arg.id);
        if (idx !== -1) comments[idx] = action.payload;
      })
      .addCase(addComment.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        if (state.byPostId[postId]) {
          state.byPostId[postId] = state.byPostId[postId].filter(
            (c) => c.id !== action.meta.arg.id
          );
        }
      });
  },
});

export default commentsSlice.reducer;