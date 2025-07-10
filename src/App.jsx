import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // path correct kar lena
import HompePage from './routes/HompePage';

import Write from './routes/Write';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import SinglePostPage from './routes/SinglePostPage';
import PostListPage from './routes/PostListPage';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HompePage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/:slug" element={<SinglePostPage />} />
        <Route path="/write" element={<Write />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default App;
