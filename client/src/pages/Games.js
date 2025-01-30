import React from 'react';
import TicTacToe from './games/components/TicTacToe';
import RockPaperScissors from './games/components/RockPaperScissors';
import './Games.css';

function Games() {
  return (
    <div className="games-page">
      <h1>Two Player Games</h1>
      <div className="games-container">
        <div className="game-wrapper">
          <TicTacToe />
        </div>
        <div className="game-wrapper">
          <RockPaperScissors />
        </div>
      </div>
    </div>
  );
}

export default Games; 