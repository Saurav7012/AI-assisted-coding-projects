import React from 'react'
import Board from './components/Board'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Tic Tac Toe</h1>
        <Board />
      </div>
    </div>
  )
}
