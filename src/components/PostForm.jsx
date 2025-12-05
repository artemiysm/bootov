import React, { useState } from 'react';

export const PostForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        userId: 1,
        title: title.trim(),
        body: body.trim(),
      });
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '20px',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3>{initialData ? '✏️ Edit Post' : '➕ Add New Post'}</h3>

      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

      <div style={{ marginBottom: '12px' }}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
          style={{
            width: '100%',
            padding: '6px',
            marginTop: '4px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Content:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something..."
          required
          rows="4"
          style={{
            width: '100%',
            padding: '6px',
            marginTop: '4px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
          }}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginRight: '8px',
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};