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
