// src/components/PostDetail.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getPost, getCommentsByPostId, createComment } from '../api/api';

export const PostDetail = () => {
  const { id } = useParams(); // получаем id из URL: /posts/1
  const postId = Number(id);

  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    body: '',
  });

  // ✅ Запрос поста
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
    error: postErr,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !isNaN(postId) && postId > 0,
    staleTime: 1000 * 60 * 2, // 2 минуты
  });

  // ✅ Зависимый запрос: комментарии (запускается ТОЛЬКО после загрузки поста)
  const {
    data: comments = [],
    isLoading: commentsLoading,
    isError: commentsError,
    error: commentsErr,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!post, // ← зависит от `post`
  });

  const queryClient = useQueryClient();

  // ✅ Мутация: добавить комментарий (оптимистичная)
  const addCommentMutation = useMutation({
    mutationFn: (comment) => createComment(comment),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const tempId = Date.now();
      const optimisticComment = { id: tempId, ...newComment, postId };

      // Сохраняем предыдущее состояние для rollback
      const previousComments = queryClient.getQueryData(['comments', postId]);

      // Обновляем кэш немедленно
      queryClient.setQueryData(['comments', postId], (old) => [
        optimisticComment,
        ...(old || []),
      ]);

      return { previousComments, tempId };
    },
    onError: (err, newComment, context) => {
      // Rollback при ошибке
      queryClient.setQueryData(['comments', postId], context.previousComments);
    },
    onSuccess: (realComment, newComment, context) => {
      // Заменяем временный комментарий на настоящий
      queryClient.setQueryData(['comments', postId], (old) =>
        old.map(c => c.id === context.tempId ? realComment : c)
      );
    },
    onSettled: () => {
      // Опционально: инвалидируем, если нужно (но setQueryData уже обновил)
      // queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.body.trim()) return;

    addCommentMutation.mutate({
      postId,
      name: newComment.name || 'Anonymous',
      email: newComment.email || 'anonymous@example.com',
      body: newComment.body.trim(),
    });

    // Сброс формы после отправки (даже если pending)
    setNewComment({ name: '', email: '', body: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // === Рендер ===
  if (postLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading post...</h2>
      </div>
    );
  }

  if (postError) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>⚠️ Failed to load post</h2>
        <p>{postErr.message}</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginBottom: '16px',
          color: '#007bff',
          textDecoration: 'none',
        }}
      >
        ← Back to Posts
      </Link>

      {post && (
        <article style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#333' }}>{post.title}</h1>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.body}</p>
          <small style={{ color: '#666' }}>By user #{post.userId}</small>
        </article>
      )}

      <section>
        <h3>💬 Comments ({comments.length})</h3>

    {commentsError && (
    <div style={{ color: 'red', marginBottom: '16px' }}>
         Failed to load comments: {commentsErr?.message || 'Unknown error'}
        <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ['comments', postId] })}
        style={{ marginLeft: '8px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}
        >
        ↻ Retry
        </button>
    </div>
    )}

        {commentsLoading && <p>Loading comments...</p>}

        {!commentsLoading && !commentsError && (
          <div style={{ marginTop: '16px' }}>
            {comments.length === 0 ? (
              <p>No comments yet. Be the first!</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    style={{
                      padding: '12px',
                      marginBottom: '10px',
                      border: '1px solid #eee',
                      borderRadius: '6px',
                      backgroundColor: comment.id < 0 ? '#fff8e1' : '#f9f9f9', // временное — жёлтый фон
                    }}
                  >
                    <strong>{comment.name}</strong> • {comment.email}
                    <div style={{ marginTop: '6px', color: '#444' }}>{comment.body}</div>
                    {comment.id < 0 && (
                      <small style={{ color: '#999', fontStyle: 'italic' }}>(sending...)</small>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Форма добавления комментария */}
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '24px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h4>Add a Comment</h4>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              name="name"
              value={newComment.name}
              onChange={handleInputChange}
              placeholder="Your name"
              style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
            />
            <input
              type="email"
              name="email"
              value={newComment.email}
              onChange={handleInputChange}
              placeholder="Your email"
              style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
            />
            <textarea
              name="body"
              value={newComment.body}
              onChange={handleInputChange}
              placeholder="Write your comment..."
              rows="4"
              required
              style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
            />
          </div>
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: addCommentMutation.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {addCommentMutation.isPending ? 'Sending...' : '💬 Post Comment'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default PostDetail;