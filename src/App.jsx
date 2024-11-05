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
  const [wordPositions, setWordPositions] = useState({})

  const dudCharacters = ['(', '?', ']', '>', ';', ')'] // Dud character remove words

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
    const words = [
      'PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRITTY', 'POLITE', 'HOUSES', 'GRANDE', 
      'RANDOM', 'OBJECT', 'MASTER', 'TARGET', 'REPLAY', 'STRING', 'SCALAR', 'VECTOR', 'MEMORY', 'BINARY', 'DEVICE', 
      'MODULE', 'ACCESS', 'SYSTEM', 'PROCESS', 'BUFFER', 'SECURE', 'INLINE', 'FORMAT'
    ]
    const randomWords = []
    while (randomWords.length < 15) {
      const word = words[Math.floor(Math.random() * words.length)]
      if (!randomWords.includes(word)) randomWords.push(word)
    }
    return randomWords
  }

  const getRandomCharacter = () => {
    const characters = ['*', '@', '#', '$', '%', '&', '!', '^', '?']
    return characters[Math.floor(Math.random() * characters.length)]
  }

  const generateWordGrid = (randomWords) => {
    const gridSize = 25
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => getRandomCharacter())
    )
  
    const positions = {}
    let attempts = 0
  
    randomWords.forEach((word) => {
      let placed = false
      let attemptCounter = 0
  
      while (!placed && attemptCounter < 50) {
        const row = Math.floor(Math.random() * gridSize)
        const col = Math.floor(Math.random() * (gridSize - word.length))
        let canPlace = true
  
        // Check if all cells in the word's position are eligible for replacement
        for (let i = 0; i < word.length; i++) {
          const cell = grid[row][col + i]
          if (cell !== '*' && cell !== '@' && cell !== '#' && cell !== '$' && cell !== '%' && cell !== '&' && cell !== '!' && cell !== '^' && cell !== '?') {
            canPlace = false
            break
          }
        }
  
        // Add word to the grid and update positions
        if (canPlace) {
          positions[word] = { row, col }
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i]
          }
          placed = true
        }
        attemptCounter++
      }
  
      // avoid infinite loop if words cannot be placed
      attempts++
    })
  
    setWordGrid(grid)
    setWordPositions(positions)
  }
  

  const handleWordClick = (word) => {
    if (!gameOver && gameActive) {
      checkPassword(word)
    }
  }

  const handleDudRemoval = () => {
    const incorrectWords = options.filter(word => word !== password && wordPositions[word])

    if (incorrectWords.length > 0) {
      const randomDud = incorrectWords[Math.floor(Math.random() * incorrectWords.length)]
      const { row, col } = wordPositions[randomDud]
      const updatedGrid = [...wordGrid]
      for (let i = 0; i < randomDud.length; i++) {
        updatedGrid[row][col + i] = getRandomCharacter()
      }

      setWordGrid(updatedGrid)
      const updatedOptions = options.filter(word => word !== randomDud)
      setOptions(updatedOptions)

      const updatedPositions = { ...wordPositions }
      delete updatedPositions[randomDud]
      setWordPositions(updatedPositions)

      setOutput([...output, `> Dud removed: ${randomDud}`])
    } else {
      setOutput([...output, '> No more duds to remove!'])
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
          const wordAtPosition = Object.keys(wordPositions).find((word) => {
            const { row, col } = wordPositions[word]
            return row === rowIndex && col <= colIndex && colIndex < col + word.length
          })

          if (wordAtPosition) {
            return (
              <span
                key={colIndex}
                className="grid-cell word"
                onClick={() => handleWordClick(wordAtPosition)}
                onMouseEnter={() => handleWordHover(wordAtPosition, true)}
                onMouseLeave={() => handleWordHover(wordAtPosition, false)}
              >
                {cell}
              </span>
            )
          } else if (dudCharacters.includes(cell)) {
            return (
              <span
                key={colIndex}
                className="grid-cell dud"
                onClick={handleDudRemoval}
              >
                {cell}
              </span>
            )
          } else {
            return (
              <span key={colIndex} className="grid-cell">
                {cell}
              </span>
            )
          }
        })}
      </div>
    ))
  }

  const handleWordHover = (word, isHovered) => {
    const { row, col } = wordPositions[word]
    const updatedGrid = [...wordGrid]

    for (let i = 0; i < word.length; i++) {
      updatedGrid[row][col + i] = isHovered ? word[i].toUpperCase() : word[i]
    }

    setWordGrid(updatedGrid)
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