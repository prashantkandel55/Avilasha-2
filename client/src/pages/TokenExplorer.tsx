import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TokenList from '../components/TokenList';
import TokenDetail from '../components/TokenDetail';

const TokenExplorer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<TokenList />} />
        <Route path="/:id" element={<TokenDetail />} />
      </Routes>
    </div>
  );
};

export default TokenExplorer;
