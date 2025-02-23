import React from 'react';
import { Outlet } from 'react-router-dom';

const GamesLayout = () => {
  return (
    <div className="games-container">
      <Outlet />
    </div>
  );
};

export default GamesLayout;