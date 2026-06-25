import React from 'react'

export default function Square({ value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-100 rounded text-2xl font-semibold hover:bg-gray-200"
    >
      {value}
    </button>
  )
}
