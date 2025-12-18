// src/pages/post-list/ui/PostListPage.jsx
import React, { useEffect } from 'react';
import { usePosts } from '../../../features/post-list/model/hooks';
import { PostList } from '../../../features/post-list/ui/PostList';

export const PostListPage = () => {
  const { posts, loading, error, dispatch } = usePosts();

  useEffect(() => {
    if (posts.length === 0) {
      dispatch({ type: 'posts/fetchPosts/pending' }); // или лучше через thunk
      // Но лучше использовать хук с вызовом fetchPosts
    }
  }, [dispatch, posts.length]);

  return (
    <PostList 
      posts={posts}
      loading={loading}
      error={error}
      onAdd={(post) => dispatch({ type: 'posts/addPost/pending', payload: post })}
      onEdit={(id, data) => dispatch({ type: 'posts/editPost/pending', payload: { id, data } })}
      onDelete={(id) => dispatch({ type: 'posts/removePost/pending', payload: id })}
    />
  );
};
