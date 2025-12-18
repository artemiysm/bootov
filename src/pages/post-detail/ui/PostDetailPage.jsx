import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  selectCommentsByPostId,
  selectCommentsLoading,
  selectCommentsError,
} from '../../../store/hooks';
import { fetchCommentsByPostId, addComment } from '../../../features/post-comments/model/slice';
import { getPost } from '../../../shared/api/api'; // ← будем использовать напрямую (пока не в Redux)

export const PostDetailPage = () => {
  const { id } = useParams();
  const postId = Number(id);
  const dispatch = useAppDispatch();

  const comments = useAppSelector(selectCommentsByPostId(postId));
  const commentsLoading = useAppSelector(selectCommentsLoading);
  const commentsError = useAppSelector(selectCommentsError);

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    body: '',
  });

  // Загрузка поста (локально, без Redux — можно добавить позже)
  useEffect(() => {
    if (!isNaN(postId) && postId > 0) {
      setPostLoading(true);
      setPostError(null);
      getPost(postId)
        .then((data) => {
          setPost(data);
          setPostLoading(false);
        })
        .catch((err) => {
          setPostError(err.message || 'Failed to load post');
          setPostLoading(false);
        });
    }
  }, [postId]);

  // Загрузка комментариев через Redux
  useEffect(() => {
    if (!isNaN(postId) && postId > 0) {
      dispatch(fetchCommentsByPostId(postId));
    }
  }, [dispatch, postId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.body.trim()) return;

    dispatch(
      addComment({
        postId,
        name: newComment.name || 'Anonymous',
        email: newComment.email || 'anonymous@example.com',
        body: newComment.body.trim(),
      })
    );

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
        <h2>Failed to load post</h2>
        <p>{postError}</p>
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
        <h3>Comments ({comments.length})</h3>

        {commentsError && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            Failed to load comments: {commentsError}
            <button
              onClick={() => dispatch(fetchCommentsByPostId(postId))}
              style={{
                marginLeft: '8px',
                color: '#007bff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {commentsLoading === 'pending' && <p>Loading comments...</p>}

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
                      backgroundColor: comment.id < 0 ? '#fff8e1' : '#f9f9f9',
                    }}
                  >
                    <strong>{comment.name}</strong> • {comment.email}
                    <div style={{ marginTop: '6px', color: '#444' }}>
                      {comment.body}
                    </div>
                    {comment.id < 0 && (
                      <small style={{ color: '#999', fontStyle: 'italic' }}>
                        (sending...)
                      </small>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Форма добавления комментария */}
        <form
          onSubmit={handleCommentSubmit}
          style={{
            marginTop: '24px',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
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
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Post Comment
          </button>
        </form>
      </section>
    </div>
  );
};

export default PostDetailPage;