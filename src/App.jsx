import React, { useState, useEffect } from 'react'
import './App.css'
import OpeningScreen from './OpeningScreen.jsx'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState(['Welcome to RobCo Industries Termlink'])
  const [gameActive, setGameActive] = useState(false)
  const [options, setOptions] = useState([])
  const [password, setPassword] = useState('')
  const [lives, setLives] = useState(3)
  const [hint, setHint] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [wordGrid, setWordGrid] = useState([])

  // Game start function 
  const gameStart = () => {
    setGameStarted(true)
    setOutput(['Welcome to RobCo Industries TermLink'])
  }

  // Password game setup function
  const startGame = () => {
    setGameActive(true)
    setLives(3)
    setGameOver(false)
    const randomWords = generateRandomWords()
    const chosenPassword = randomWords[Math.floor(Math.random() * randomWords.length)]
    setOptions(randomWords)
    setPassword(chosenPassword)
    setHint(`Hint: The password has ${chosenPassword.length} letters.`)
    setOutput([...output, 'Password Hack Initiated. You have 3 tries'])

    generateWordGrid(randomWords) // Create grid
  }

  // Generates random words
  const generateRandomWords = () => {
    const words = ['PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRIPE', 'POLITE', 'HOUSES', 'GRANITE', 'RANDOM']
    let randomWords = []
    for (let i = 0; i < 6; i++) {
      const word = words[Math.floor(Math.random() * words.length)]
      randomWords.push(word)
    }
    return randomWords
  }

  // Generate a random filler character
  const getRandomCharacter = () => {
    const characters = ['*', '@', '#', '$', '%', '&', '!', '^', '?']
    return characters[Math.floor(Math.random() * characters.length)]
  }

  // Generate word grid with filler characters and words
  const generateWordGrid = (randomWords) => {
    const gridSize = 20 // 20 rows of grid
    const grid = []

    for (let row = 0; row < gridSize; row++) {
      const rowArray = []
      for (let col = 0; col < 20; col++) {
        rowArray.push(getRandomCharacter())
      }
      grid.push(rowArray)
    }

    // Randomly place words in the grid
    randomWords.forEach((word) => {
      let placed = false
      while (!placed) {
        const row = Math.floor(Math.random() * gridSize)
        const col = Math.floor(Math.random() * (20 - word.length))
        if (grid[row].slice(col, col + word.length).every((cell) => !randomWords.includes(cell))) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i]
          }
          placed = true
        }
      }
    })

    setWordGrid(grid)
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
  } // Close processCommand function

  const handleInput = (event) => {
    if (event.key === 'Enter') {
      if (gameOver) {
        setOutput([...output, 'Terminal Locked. Game Over.'])
        setInput('')
        return
      }

      if (gameActive) {
        checkPassword(input)
      } else {
        processCommand(input)
      }
      setInput('')
    }
  }

  const checkPassword = (guess) => {
    if (guess === password) {
      setOutput([...output, `> ${guess}`, 'Access Granted. Welcome, user.'])
      setGameActive(false)
    } else {
      const matches = calculateMatchingLetters(guess, password);
      const newHint = `Hint: ${matches} letters match the correct password position.`
      setHint(newHint)
      setLives((prev) => prev - 1)

      if (lives - 1 <= 0) {
        setGameOver(true);
        setOutput([...output, `> ${guess}`, 'Incorrect. Terminal Locked.'])
      } else {
        setOutput([...output, `> ${guess}`, `Incorrect password. ${newHint} You have ${lives - 1} attempts remaining.`])
      }
    }
  }

  const calculateMatchingLetters = (guess, password) => {
    let matchCount = 0
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === password[i]) matchCount++
    }
    return matchCount
  }

  // Render the word grid
  const renderWordGrid = () => {
    return wordGrid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, colIndex) => (
          <span key={colIndex} className="grid-cell">{cell}</span>
        ))}
      </div>
    ))
  }

  return (
    <div className="terminal">
      {!gameStarted ? (
        <OpeningScreen onStart={gameStart} />
      ) : (
        <>
          {output.map((line, index) => (
            <div key={index} className="output">{line}</div>
          ))}
          {gameActive && (
            <div className="word-grid">{renderWordGrid()}</div>
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

