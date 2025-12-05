import React, { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { PostForm } from './PostForm';
import { fetchPosts, createPost, updatePost, deletePost } from '../api/api';

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // Загрузка постов при старте
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError('⚠️ Failed to load posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Добавление поста
  const handleAddPost = async (newPost) => {
    try {
      const created = await createPost(newPost);
      // Добавим в начало списка (ограничим 10)
      setPosts([created, ...posts.slice(0, 9)]);
    } catch (err) {
      alert('❌ Failed to add post.');
    }
  };

  // Обновление поста
  const handleUpdatePost = async (updatedData) => {
    try {
      const updated = await updatePost(editingPost.id, updatedData);
      setPosts(posts.map(p => (p.id === updated.id ? updated : p)));
      setEditingPost(null);
    } catch (err) {
      alert('❌ Failed to update post.');
    }
  };

  // Удаление поста
  const handleDeletePost = (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    deletePost(id)
      .then(() => {
        setPosts(posts.filter(p => p.id !== id));
      })
      .catch(() => {
        alert('❌ Failed to delete post.');
      });
  };

  return (
    <div>
      <h2 style={{ color: '#333' }}>📝 Posts Manager</h2>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Форма добавления */}
      {!editingPost && <PostForm onSubmit={handleAddPost} />}

      {/* Форма редактирования */}
      {editingPost && (
        <PostForm
          initialData={editingPost}
          onSubmit={(data) => handleUpdatePost(data)}
          onCancel={() => setEditingPost(null)}
        />
      )}

      {/* Загрузка */}
      {loading && <Loading />}

      {/* Список постов */}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

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
            <p style={{ margin: '0 0 12px 0', color: '#555' }}>{post.body}</p>
            <small style={{ color: '#888' }}>User #{post.userId}</small>

            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setEditingPost(post)}
                style={{
                  marginRight: '8px',
                  padding: '4px 10px',
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
                  padding: '4px 10px',
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