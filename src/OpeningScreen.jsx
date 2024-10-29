import React from 'react'
import './App.css'

const OpeningScreen = ({ onStart }) => {
  return (
    <div className="opening-screen">
      <h1>RobCo Industries Terminal</h1>
      <button onClick={onStart} className="start-button">Start</button>
    </div>
  )
}

export default OpeningScreen