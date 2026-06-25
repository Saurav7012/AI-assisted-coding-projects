import React, { useState } from 'react'
import Square from './Square'

const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function calculateWinner(squares) {
  for (const [a,b,c] of winningLines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(squares)

  function handleClick(i) {
    if (winner || squares[i]) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  const status = winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? 'Draw'
      : `Next: ${xIsNext ? 'X' : 'O'}`

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="mb-4 text-center font-medium">{status}</div>
      <div className="grid grid-cols-3 gap-3">
        {squares.map((val, idx) => (
          <Square key={idx} value={val} onClick={() => handleClick(idx)} />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset</button>
        <div className="text-sm text-gray-500">Tip: Click a square to play</div>
      </div>
    </div>
  )
}
