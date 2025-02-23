import React from 'react';
import { useNavigate } from 'react-router-dom';
import { gameConfig } from './config/gameConfig';
import './Games.css';

const GamesList = () => {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    navigate(`${gameId}`);
  };

  return (
    <div className='games-page'>
      <h1>Game Collection</h1>
      <div className='games-grid'>
        {gameConfig.map((game) => (
          <div 
            key={game.id} 
            className='game-card'
            onClick={() => handleGameClick(game.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleGameClick(game.id);
              }
            }}
          >
            <div className='game-card-content'>
              <h3>{game.title}</h3>
              <div className='game-info'>
                <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
                <span className='duration'>{game.duration}</span>
              </div>
              <p>{game.description}</p>
              <div className='players-info'>
                {game.players.min === game.players.max ? 
                  `${game.players.min} Player` : 
                  `${game.players.min}-${game.players.max} Players`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;