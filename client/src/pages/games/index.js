import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GamesList from './GamesList';
import GameDetail from './GameDetail';
import GamePlay from './components/GamePlay';

function Games() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<GamesList />} />
        <Route path=":id">
          <Route index element={<GameDetail />} />
          <Route path="play" element={<GamePlay />} />
        </Route>
        <Route path="*" element={<Navigate to="/games" />} />
      </Route>
    </Routes>
  );
}

export default Games;
