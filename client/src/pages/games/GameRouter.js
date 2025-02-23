import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GamesList from './GamesList';
import GameDetail from './GameDetail';
import GamePlay from './components/GamePlay';

const GameRouter = () => {
  const location = useLocation();
  const isRoot = location.pathname === '/games';

  return (
    <Routes>
      {isRoot ? (
        <Route index element={<GamesList />} />
      ) : (
        <>
          <Route path="" element={<GamesList />} />
          <Route path=":id" element={<GameDetail />} />
          <Route path=":id/play" element={<GamePlay />} />
        </>
      )}
    </Routes>
  );
};

export default GameRouter;