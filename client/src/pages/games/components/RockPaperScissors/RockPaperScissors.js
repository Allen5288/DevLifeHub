import React, { useState } from 'react';
import './RockPaperScissors.css';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const choices = ['rock', 'paper', 'scissors'];

  const getWinner = (choice1, choice2) => {
    if (choice1 === choice2) return 'draw';
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'player1';
    }
    return 'player2';
  };

  const handleChoice = (choice) => {
    if (currentPlayer === 1) {
      setPlayerChoice(choice);
      setCurrentPlayer(2);
    } else {
      setPlayer2Choice(choice);
      const gameResult = getWinner(playerChoice, choice);
      setResult(
        gameResult === 'draw' 
          ? "It's a draw!" 
          : gameResult === 'player1' 
            ? 'Player 1 wins!' 
            : 'Player 2 wins!'
      );
      if (gameResult === 'player1') {
        setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
      } else if (gameResult === 'player2') {
        setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
      }
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setPlayer2Choice(null);
    setResult(null);
    setCurrentPlayer(1);
  };

  const resetScore = () => {
    setScore({ player1: 0, player2: 0 });
    resetGame();
  };

  const buttonStyle = {
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
    backgroundColor: 'white',
    color: '#007bff'
  };

  return (
    <div className="rock-paper-scissors">
      <h2>Rock Paper Scissors</h2>
      <div className="score">
        <span>Player 1: {score.player1}</span>
        <span>Player 2: {score.player2}</span>
      </div>
      
      <div className="game-status">
        {!result && (
          <h3>{`Player ${currentPlayer}'s turn`}</h3>
        )}
        {result && <h3>{result}</h3>}
      </div>

      <div className="choices">
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            onTouchStart={handleTouchStart}
            disabled={result !== null}
            style={buttonStyle}
          >
            {choice.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="controls">
        <button onClick={resetGame}>Next Round</button>
        <button onClick={resetScore}>Reset Score</button>
      </div>
    </div>
  );
};

export default RockPaperScissors;