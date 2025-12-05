// src/components/PostList.jsx
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loading } from './Loading';
import { PostForm } from './PostForm';
import {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from '../hooks/usePosts';

export const PostList = () => {
  const [editingPost, setEditingPost] = useState(null);

  // ✅ Получаем данные через кастомный хук
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePosts();

  // ✅ Мутации через кастомные хуки
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();


  // Обработчики
  const handleAddPost = (newPost) => {
    createMutation.mutate(newPost);
  };

  const handleUpdatePost = (data) => {
    if (!editingPost) return;
    updateMutation.mutate({ id: editingPost.id, data });
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    if (!window.confirm('Delete this post?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <h2 style={{ color: '#333' }}>📝 Posts (React Query)</h2>

      {isError && (
        <div style={{ color: 'red', marginBottom: '16px', fontWeight: 'bold' }}>
          ❌ Error: {error.message || 'Failed to load posts'}
          <button
            onClick={() => refetch()}
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
            ↻ Retry
          </button>
        </div>
      )}

      {!editingPost && (
        <PostForm
          onSubmit={handleAddPost}
          isSubmitting={createMutation.isPending}
        />
      )}

      {editingPost && (
        <PostForm
          initialData={editingPost}
          onSubmit={handleUpdatePost}
          onCancel={() => setEditingPost(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}

      {isLoading && <Loading />}
      {!isLoading && !isError && posts.length === 0 && <p>No posts available.</p>}

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
                disabled={updateMutation.isPending || deleteMutation.isPending}
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
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDeletePost(post.id)}
                disabled={deleteMutation.isPending}
                style={{
                  padding: '6px 12px',
                  backgroundColor:
                    deleteMutation.variables === post.id && deleteMutation.isPending
                      ? '#c82333'
                      : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {deleteMutation.variables === post.id && deleteMutation.isPending
                  ? '🗑️ Deleting...'
                  : '🗑️ Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;