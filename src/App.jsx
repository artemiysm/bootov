import React from 'react';
import './App.css';
import { PostList } from './components/PostList';

function App() {
  return (
    <div className="App">
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        <PostList />
      </main>
    </div>
  );
}

export default App;