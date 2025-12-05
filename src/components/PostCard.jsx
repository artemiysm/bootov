// src/components/PostCard.jsx
import React, { useState } from 'react';
import { useUpdatePost, useDeletePost } from '../hooks/usePosts';
import { useUserById } from '../hooks/useUsers';

export default function PostCard({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);

  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  // Зависимый запрос: получаем автора поста
  const { data: author, isLoading: authorLoading } = useUserById(post.userId);

  const handleSave = () => {
    if (!editTitle.trim() || !editBody.trim()) return;
    updatePost({ id: post.id, data: { title: editTitle, body: editBody } });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить пост "${post.title}"?`)) {
      deletePost(post.id);
    }
  };

  return (
    <div style={styles.card}>
      {isEditing ? (
        <div>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows="3"
            style={styles.textarea}
          />
          <div style={styles.actions}>
            <button onClick={handleSave} disabled={isUpdating} style={styles.saveBtn}>
              {isUpdating ? 'Сохранение...' : '✅ Сохранить'}
            </button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.header}>
            <h3>{post.title}</h3>
            <span>ID: {post.id}</span>
          </div>
          <p>{post.body}</p>
          <div>
            Автор: {authorLoading ? 'Загрузка...' : author?.name || '—'}
            <small style={{ marginLeft: '8px', color: '#888' }}>
              @{author?.username}
            </small>
          </div>
          <div style={styles.actions}>
            <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
              ✏️ Редактировать
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                ...styles.deleteBtn,
                opacity: isDeleting ? 0.6 : 1,
              }}
            >
              {isDeleting ? 'Удаление...' : '🗑️ Удалить'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '6px 12px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};