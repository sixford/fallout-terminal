import React, { useState } from 'react'
import './App.css'
import OpeningScreen from './OpeningScreen.jsx'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [output, setOutput] = useState(['Welcome to RobCo Industries Termlink'])
  const [gameActive, setGameActive] = useState(false)
  const [options, setOptions] = useState([])
  const [password, setPassword] = useState('')
  const [lives, setLives] = useState(3)
  const [hint, setHint] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [wordGrid, setWordGrid] = useState([])

  const gameStart = () => {
    setGameStarted(true)
    setOutput(['Welcome to RobCo Industries TermLink'])
    startGame()
  }

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

    generateWordGrid(randomWords)
  }

  const generateRandomWords = () => {
    const words = ['PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRIPE', 'POLITE', 'HOUSES', 'GRANITE', 'RANDOM']
    let randomWords = []
    for (let i = 0; i < 6; i++) {
      const word = words[Math.floor(Math.random() * words.length)]
      randomWords.push(word)
    }
    return randomWords
  }

  const getRandomCharacter = () => {
    const characters = ['*', '@', '#', '$', '%', '&', '!', '^', '?']
    return characters[Math.floor(Math.random() * characters.length)]
  }

  const generateWordGrid = (randomWords) => {
    const gridSize = 20
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: 20 }, () => getRandomCharacter())
    )

    randomWords.forEach((word) => {
      let placed = false
      while (!placed) {
        const row = Math.floor(Math.random() * gridSize)
        const col = Math.floor(Math.random() * (20 - word.length))
        if (grid[row].slice(col, col + word.length).every((cell) => !randomWords.includes(cell))) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word
          }
          placed = true
        }
      }
    })

    setWordGrid(grid)
  }

  const handleWordClick = (word) => {
    if (!gameOver && gameActive) {
      checkPassword(word)
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

  const calculateMatchingLetters = (guess, password) => {
    let matchCount = 0
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === password[i]) matchCount++
    }
    return matchCount
  }

  const renderWordGrid = () => {
    return wordGrid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, colIndex) => {
          const isWord = options.includes(cell);
          return (
            <span
              key={colIndex}
              className={`grid-cell ${isWord ? 'word' : ''}`}
              onClick={() => isWord && handleWordClick(cell)}
            >
              {isWord ? cell : getRandomCharacter()}
            </span>
          )
        })}
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
        </>
      )}
    </div>
  )
}

export default App
