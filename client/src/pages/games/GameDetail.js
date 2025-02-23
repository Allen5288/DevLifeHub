import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameConfig } from './config/gameConfig';
import './GameDetail.css';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const game = gameConfig.find(g => g.id === id);

  useEffect(() => {
    // If game is not found, redirect to games list
    if (!game) {
      navigate('/games');
    }
  }, [game, navigate]);

  if (!game) return null;

  const handlePlay = () => {
    navigate('play'); // Changed to use relative path 'play' instead of `${id}/play`
  };

  return (
    <div className="game-detail">
      <button 
        className="back-button" 
        onClick={() => navigate('/games')}
      >
        ← Back to Games
      </button>
      <div className="game-detail-content">
        <h1>{game.title}</h1>
        <div className="game-meta">
          <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
            {game.difficulty}
          </span>
          <span className="duration">{game.duration}</span>
          <span className="players">
            {game.players.min === game.players.max ? 
              `${game.players.min} Player` : 
              `${game.players.min}-${game.players.max} Players`}
          </span>
        </div>
        <div className="game-description">
          <h2>About this game</h2>
          <p>{game.description}</p>
        </div>
        <button 
          className="play-button"
          onClick={handlePlay}
        >
          Play Game
        </button>
      </div>
    </div>
  );
}

export default GameDetail;