export const gameConfig = [
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    difficulty: 'Easy',
    duration: '3-5 min',
    description: 'Classic game of X\'s and O\'s. Take turns marking spaces on a 3x3 grid, trying to get three in a row.',
    players: { min: 2, max: 2 }
  },
  {
    id: 'rockpaperscissors',
    title: 'Rock Paper Scissors',
    difficulty: 'Easy',
    duration: '2-3 min',
    description: 'Take turns choosing rock, paper, or scissors. Rock beats scissors, scissors beats paper, paper beats rock!',
    players: { min: 2, max: 2 }
  },
  {
    id: 'wordguess',
    title: 'Word Battle',
    difficulty: 'Medium',
    duration: '5-10 min',
    description: 'Compete with friends to guess words. Take turns giving clues and guessing!',
    players: { min: 2, max: 4 }
  },
  {
    id: 'numberpuzzle',
    title: 'Number Race',
    difficulty: 'Medium',
    duration: '5-8 min',
    description: 'Race against others to solve number puzzles. First to solve wins!',
    players: { min: 2, max: 4 }
  },
  {
    id: 'quizbattle',
    title: 'Quiz Battle',
    difficulty: 'Medium',
    duration: '10-15 min',
    description: 'Challenge your friends in various quiz categories. Test your knowledge together!',
    players: { min: 2, max: 6 }
  },
  {
    id: 'drawguess',
    title: 'Draw & Guess',
    difficulty: 'Easy',
    duration: '8-12 min',
    description: 'One player draws, others guess! Take turns and have fun with this classic party game.',
    players: { min: 2, max: 6 }
  }
];