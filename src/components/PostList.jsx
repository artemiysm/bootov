import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, selectPosts, selectPostsLoading, selectPostsError } from '../store/hooks';
import { fetchPosts, addPost, editPost, removePost } from '../store/slices/postsSlice';
import { PostForm } from './PostForm';

export const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  const handleAddPost = (newPost) => {
    dispatch(addPost(newPost));
  };

  const handleUpdatePost = (data) => {
    if (!editingPost) return;
    dispatch(editPost({ id: editingPost.id, data }));
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    if (!window.confirm('Delete this post?')) return;
    dispatch(removePost(id));
  };

  return (
    <div>
      <h2 style={{ color: '#333' }}>Posts (Redux Toolkit)</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '16px', fontWeight: 'bold' }}>
          Error: {error}
          <button
            onClick={() => dispatch(fetchPosts())}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!editingPost && <PostForm onSubmit={handleAddPost} />}
      {editingPost && (
        <PostForm
          initialData={editingPost}
          onSubmit={handleUpdatePost}
          onCancel={() => setEditingPost(null)}
        />
      )}

      {loading === 'pending' && <div>Loading...</div>}
      {!loading && !error && posts.length === 0 && <p>No posts available.</p>}

      <div style={{ marginTop: '20px' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              padding: '16px',
              marginBottom: '12px',
              border: '1px solid #e1e1e1',
              borderRadius: '6px',
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', color: '#222' }}>{post.title}</h4>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}>{post.body}</p>
            <small style={{ color: '#888' }}>User #{post.userId}</small>
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setEditingPost(post)}
                style={{
                  marginRight: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(post.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;