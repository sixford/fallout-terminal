import React, { useState, useEffect } from 'react'
import './App.css'
import OpeningScreen from './OpeningScreen.jsx'

function App() {
  const [gameStarted, setGameStarted] = useState(false) // Tracks if the game has started
  const [input, setInput] = useState('') // Stores user input
  const [output, setOutput] = useState(['Welcome to RobCo Industries Termlink'])
  const [gameActive, setGameActive] = useState(false) // Tracks if the password game is active
  const [options, setOptions] = useState([]) // Password options for the game
  const [password, setPassword] = useState('') // Correct password
  const [lives, setLives] = useState(3) // Number of lives
  const [hint, setHint] = useState('') // Hint for the game
  const [gameOver, setGameOver] = useState(false)// Tracks if the game is over
  const [wordGrid, setWordGrid] = useState([])// New state for grid of words

  // Game start function 
  const gameStart = () => {
    setGameStarted(true)
    setOutput(['Welcome to RobCo Industries TermLink'])
    console.log('Game started:', gameStarted)
    console.log('Output:', output)
  }

  // Password game setup function
  const startGame = () => {
    console.log("Setting up the password game...")
    setGameActive(true)
    setLives(3)
    setGameOver(false)
    const randomWords = generateRandomWords()
    const chosenPassword = randomWords[Math.floor(Math.random() * randomWords.length)]
    setOptions(randomWords)
    setPassword(chosenPassword)
    setHint(`Hint: The password has ${chosenPassword.length} letters.`)
    setOutput([...output, 'Password Hack Initiated. You have 3 tries'])

    console.log('Password game started:', gameActive)
    console.log('Lives set to:', lives)
    console.log('Random words:', randomWords)
    console.log('Chosen password:', chosenPassword)
    console.log('Hint:', hint)

    // Grid generation for random words
    const grid = randomWords.map((word, index) => ({
      word,
      x: Math.floor(Math.random() * 10) * 60,  // grid size and spacing
      y: Math.floor(index / 2) * 24
    }))
    setWordGrid(grid)

    console.log('Generated word grid:', grid)
  }

  // Generates random words for password game
  const generateRandomWords = () => {
    const words = ['PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRIPE', 'POLITE', 'HOUSES', 'GRANITE', 'RANDOM']
    let randomWords = []
    for (let i = 0; i < 6; i++) {
      const word = words[Math.floor(Math.random() * words.length)]
      randomWords.push(word)
    }
    console.log('Generated random words:', randomWords)
    return randomWords
  }

  const processCommand = (command) => {
    let response = 'Unknown command'
    if (command === 'help') {
      response = 'Available commands: help, about, hack'
    } else if (command === 'about') {
      response = 'RobCo Industries (TM) Terminal'
    } else if (command === 'hack') {
      startGame()
      response = 'Password Hack Initiated. Type your guess.'
    }
    setOutput([...output, `> ${command}`, response])
  }

  const handleInput = (event) => {
    if (event.key === 'Enter') {
      console.log("Input received:", input)
      if (gameOver) {
        setOutput([...output, 'Terminal Locked. Game Over.'])
        setInput('')
        return
      }
  
      if (gameActive) {
        console.log("Game is active. Checking password...")
        checkPassword(input) // Handle as password guess if game is active
      } else {
        console.log("Processing command:", input)
        processCommand(input) // Handle as command otherwise
      }
      setInput('') // Clear input field after each entry
    }
  }

  const checkPassword = (guess) => {
    if (guess === password) {
      setOutput([...output, `> ${guess}`, 'Access Granted. Welcome, user.'])
      setGameActive(false)
    } else {
      const matches = calculateMatchingLetters(guess, password)
      const newHint = `Hint: ${matches} letters match the correct password position.`
      setHint(newHint)
      setLives((prev) => prev - 1)

      if (lives - 1 <= 0) {
        setGameOver(true)
        setOutput([...output, `> ${guess}`, 'Incorrect. Terminal Locked.'])
      } else {
        setOutput([...output, `> ${guess}`, `Incorrect password. ${newHint} You have ${lives - 1} attempts remaining.`])
      }
    }
  }

  // Calculate guess and password
  const calculateMatchingLetters = (guess, password) => {
    let matchCount = 0
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === password[i]) matchCount++
    }
    return matchCount
  }

  // Main UI layout
  return (
    <div className="terminal">
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
          <div className="hint">{hint}</div>
          <input
            type="text"
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            placeholder="Enter command or password"
            disabled={gameOver}
          />
        </>
      )}
    </div>
  )
}

export default App




