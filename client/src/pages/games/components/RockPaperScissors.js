import React, { useState } from 'react'
import './RockPaperScissors.css'

function RockPaperScissors() {
  const [player1Choice, setPlayer1Choice] = useState(null)
  const [player2Choice, setPlayer2Choice] = useState(null)
  const [result, setResult] = useState('')
  const [turn, setTurn] = useState(1)

  const choices = ['Rock', 'Paper', 'Scissors']

  const determineWinner = (p1, p2) => {
    if (p1 === p2) return "It's a tie!"

    if (
      (p1 === 'Rock' && p2 === 'Scissors') ||
      (p1 === 'Paper' && p2 === 'Rock') ||
      (p1 === 'Scissors' && p2 === 'Paper')
    ) {
      return 'Player 1 wins!'
    }
    return 'Player 2 wins!'
  }

  const handleChoice = choice => {
    if (turn === 1) {
      setPlayer1Choice(choice)
      setTurn(2)
    } else {
      setPlayer2Choice(choice)
      setResult(determineWinner(player1Choice, choice))
    }
  }

  const resetGame = () => {
    setPlayer1Choice(null)
    setPlayer2Choice(null)
    setResult('')
    setTurn(1)
  }

  return (
    <div className='rps-game'>
      <h3>Rock Paper Scissors</h3>
      <div className='status'>{!result ? `Player ${turn}'s turn` : result}</div>
      <div className='choices'>
        {choices.map(choice => (
          <button key={choice} onClick={() => handleChoice(choice)} disabled={result !== ''}>
            {choice}
          </button>
        ))}
      </div>
      {result && (
        <div className='results'>
          <p>Player 1 chose: {player1Choice}</p>
          <p>Player 2 chose: {player2Choice}</p>
          <button className='reset-button' onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default RockPaperScissors
