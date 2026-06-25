import { motion } from 'motion/react';

export default function GameBoard({ board, onCellClick, winningLine, disabled }) {
  const isWinningCell = (index) => {
    return winningLine ? winningLine.includes(index) : false;
  };

  return (
    <div className="game-container flex items-center justify-center">
      <div className="board-grid">
        {board.map((cell, index) => {
          const isWinner = isWinningCell(index);
          const isFilled = cell !== null;

          return (
            <button
              key={index}
              id={`cell-${index}`}
              onClick={() => !disabled && !isFilled && onCellClick(index)}
              disabled={disabled || isFilled}
              className={`cell cell-btn transition-all duration-200 select-none ${
                isWinner
                  ? 'bg-emerald-500/15 border-2 border-emerald-500 scale-95 shadow-inner'
                  : ''
              }`}
              style={{ contentVisibility: 'auto' }}
              aria-label={`Board cell ${index + 1}, ${cell ? `marked as ${cell}` : 'empty'}`}
            >
              {cell === 'X' && (
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 stroke-[#6366f1] stroke-[6] stroke-linecap-round"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    d="M 28,28 L 72,72"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
                    d="M 72,28 L 28,72"
                  />
                </svg>
              )}

              {cell === 'O' && (
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 stroke-[#ec4899] stroke-[6] stroke-linecap-round"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <motion.circle
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    cx="50"
                    cy="50"
                    r="22"
                  />
                </svg>
              )}

              {!cell && !disabled && (
                <div className="absolute inset-0 opacity-0 hover:opacity-10 flex items-center justify-center transition-opacity duration-200">
                  <span className="text-3xl font-bold font-display text-slate-400">+</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
