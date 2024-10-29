import React, { useState } from 'react'
import './App.css'
import OpeningScreen from './OpeningScreen.jsx'

function App() {
  const [gameStarted, setGameStarted] = useState(false) // Tracks if the game has started
  const [input, setInput] = useState('') // Stores user input
  const [output, setOutput] = useState(['Welcome to RobCo Industries (TM) Termlink']);
  const [gameActive, setGameActive] = useState(false) // Tracks if the password game is active
  const [options, setOptions] = useState([]) // Password options for the game
  const [password, setPassword] = useState('')  // Correct password
  const [lives, setLives] = useState(3)  // Number of lives
  const [hint, setHint] = useState('')  // Hint for the game
  const [gameOver, setGameOver] = useState(false)// Tracks if the game is over
  const [wordGrid, setWordGrid] = useState([])

  // Game start function 
  const gameStart = () => {
    setGameStarted(true)
    setOutput(['Welcome to RobCo Industries TermLink'])
    console.log('Game started;', gameStart)
    console.log('Output:', output)
  }

  const startGame = () => {
    setGameActive(true)
    setLives(3)
    setGameOver(false)
    const randomWords = generateRandomWords()
    const Password = randomWords[Math.floor(Math.random() * randomWords.length)]
    setOptions(randomWords)
    setPassword(chosenPassword)
    setHint(`Hint: The password has ${chosenPassword.length} letters.`)
    setOutput([...output, 'Password Hack Initiated. You have 3 tries'])


    console.log('Password game started:', gameActive)
    console.log('Lives set to:', lives)
    console.log('Random words:', randomWords)
    console.log('Chosen password:', chosenPassword)
    console.log('Hint:', hint)
  }

  // Grid generation
  const grid = randomWords.map((word, index) => ({
    word,
    x: Math.floor(Math.random() * 10) * 60,
    y: Math.floor(index / 2) * 24
  }))
  setWordGrid(grid)

const getRandomWords = () => {
  const words = ['PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRIPE', 'POLITE', 'HOUSES', 'GRANITE', 'RANDOM', '']
  let randomWords = []
  for (let i = 0; i < 6; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    randomWords.push(word)
  }
  console.log('Generated random words:', randomWords)
  return randomWords
}

return (
  <div className="terminal">
    {/* Debugging and Testing Buttons */}
    <h1>Debugging Panel</h1>
    <button onClick={gameStart}>Start Game</button>
    <button onClick={startGame}>Start Password Game</button>
    <div>
      Lives: {lives}
    </div>

    {!gameStarted ? (
      <OpeningScreen onStart={gameStart} /> // Display opening screen if game not started
    ) : (
      <>
        {output.map((line, index) => (
          <div key={index} className="output">{line}</div>
        ))}
        {gameActive && (
          <div className="word-grid">
            {wordGrid.map((item, index) => (
              <span 
                key={index}
                className="word-item"
                style={{ position: 'absolute', left: item.x, top: item.y }}
              >
                {item.word}
              </span>
            ))}
          </div>
        )}
        <div className="lives">Lives: {lives}</div>
        <input
          type="text"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or password"
          disabled={gameOver}
        />
      </>
    )}
  </div>
)
}

export default App

