// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PostListPage } from './pages/post-list/ui/PostListPage'; // ← default import
import PostDetailPage from './pages/post-detail/ui/PostDetailPage'; // ← default import

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
    </Routes>
  );
}

export default App;