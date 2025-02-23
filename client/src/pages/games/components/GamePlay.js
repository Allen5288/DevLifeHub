import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicTacToe from './TicTacToe/TicTacToe';
import RockPaperScissors from './RockPaperScissors/RockPaperScissors';
import WordBattle from './WordBattle/WordBattle';
import NumberRace from './NumberRace/NumberRace';
import QuizBattle from './QuizBattle/QuizBattle';
import DrawGuess from './DrawGuess/DrawGuess';
import { gameConfig } from '../config/gameConfig';
import './GamePlay.css';

const GamePlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const gameComponents = {
    tictactoe: TicTacToe,
    rockpaperscissors: RockPaperScissors,
    wordguess: WordBattle,
    numberpuzzle: NumberRace,
    quizbattle: QuizBattle,
    drawguess: DrawGuess,
  };

  const game = gameConfig.find(g => g.id === id);
  const GameComponent = gameComponents[id];

  if (!GameComponent || !game) {
    navigate('/games');
    return null;
  }

  return (
    <div className="game-play-container">
      <button 
        className="back-button" 
        onClick={() => navigate(`/games/${id}`)}
      >
        ← Back to Game Details
      </button>
      <h2>{game.title}</h2>
      <GameComponent />
    </div>
  );
};

export default GamePlay;