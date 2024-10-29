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

const genRandomWords = () => {
  const words = ['PARISH', 'CREATE', 'SPACES', 'BOLTON', 'MODALS', 'THINGS', 'PALLET', 'GRIPE', 'POLITE', 'HOUSES', 'GRANITE', 'RANDOM', '']
}