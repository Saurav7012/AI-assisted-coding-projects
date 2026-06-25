import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { checkWinner, isBoardFull } from './utils.js';
import GameBoard from './components/GameBoard.jsx';
import { Award } from 'lucide-react';

export default function App() {
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [moveHistory, setMoveHistory] = useState([]);
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('tictactoe_scores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.x === 'number' &&
          typeof parsed.o === 'number' &&
          typeof parsed.ties === 'number'
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved scores, defaulting to 0', e);
    }
    return { x: 0, o: 0, ties: 0 };
  });

  const [currentStreak, setCurrentStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('tictactoe_current_streak');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [bestStreak, setBestStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('tictactoe_best_streak');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('tictactoe_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('tictactoe_theme', theme);
  }, [theme]);

  const [matchLogs, setMatchLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('tictactoe_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tictactoe_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('tictactoe_logs', JSON.stringify(matchLogs));
  }, [matchLogs]);

  const { winner: winPlayer, line: winningLine } = checkWinner(board);
  const isDraw = !winPlayer && isBoardFull(board);
  const isGameOver = Boolean(winPlayer) || isDraw;

  const [scoreUpdated, setScoreUpdated] = useState(false);

  useEffect(() => {
    if (isGameOver && !scoreUpdated) {
      if (winPlayer) {
        const key = winPlayer.toLowerCase();
        setScores((prev) => ({
          ...prev,
          [key]: prev[key] + 1,
        }));

        setCurrentStreak((prev) => {
          const next = prev + 1;
          if (next > bestStreak) {
            setBestStreak(next);
            localStorage.setItem('tictactoe_best_streak', String(next));
          }
          localStorage.setItem('tictactoe_current_streak', String(next));
          return next;
        });

        setMatchLogs((prev) => [
          `Player ${winPlayer} won a match`,
          ...prev.slice(0, 4),
        ]);
      } else if (isDraw) {
        setScores((prev) => ({
          ...prev,
          ties: prev.ties + 1,
        }));

        setCurrentStreak(0);
        localStorage.setItem('tictactoe_current_streak', '0');

        setMatchLogs((prev) => [
          'Match ended in a Draw',
          ...prev.slice(0, 4),
        ]);
      }
      setScoreUpdated(true);
    }
  }, [isGameOver, winPlayer, isDraw, scoreUpdated, bestStreak]);

  const handleCellClick = (index) => {
    if (board[index] || isGameOver) return;
    setMoveHistory((prev) => [...prev, [...board]]);

    const nextBoard = [...board];
    nextBoard[index] = currentTurn;
    setBoard(nextBoard);
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
  };

  const handleUndo = () => {
    if (moveHistory.length === 0 || isGameOver) return;
    const previousBoard = moveHistory[moveHistory.length - 1];
    setBoard(previousBoard);
    setMoveHistory((prev) => prev.slice(0, -1));
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
  };

  const handleResetBoard = () => {
    setBoard(Array(9).fill(null));
    setMoveHistory([]);
    setCurrentTurn('X');
    setScoreUpdated(false);
  };

  const handleResetScores = () => {
    setScores({ x: 0, o: 0, ties: 0 });
    setCurrentStreak(0);
    setBestStreak(0);
    setMatchLogs([]);
    localStorage.removeItem('tictactoe_current_streak');
    localStorage.removeItem('tictactoe_best_streak');
    handleResetBoard();
  };

  return (
    <div className={`app-shell min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 selection:bg-indigo-100 ${
      theme === 'dark' ? 'dark-shell' : ''
    }`}>
      <header className="text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-indigo-500 font-display">
            Arena v2.0.4
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
            Tic Tac Toe
          </h1>

          <div className="flex flex-col items-center gap-3 mt-4 sm:flex-row sm:justify-center sm:gap-4">
            <div className="status-indicator">
              <div
                className={`dot ${
                  isGameOver
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    : currentTurn === 'X'
                    ? 'bg-[#6366f1] shadow-[0_0_8px_#6366f1]'
                    : 'bg-[#ec4899] shadow-[0_0_8px_#ec4899]'
                }`} 
              />
              <span className="text-sm text-slate-600 font-bold tracking-wider uppercase font-display">
                {winPlayer
                  ? `PLAYER ${winPlayer} WINS!`
                  : isDraw
                  ? 'DRAW GAME'
                  : `PLAYER ${currentTurn}'S TURN`}
              </span>
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-900 font-semibold transition hover:bg-slate-100"
              type="button"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20 w-full max-w-5xl my-6">
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 w-full lg:w-auto justify-center">
          <div className="stat-card max-w-[170px] lg:w-[180px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">
              Player X
            </p>
            <p className="text-4xl font-black text-indigo-600 font-display">
              {scores.x.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="stat-card max-w-[170px] lg:w-[180px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">
              Draws
            </p>
            <p className="text-4xl font-black text-slate-600 font-display">
              {scores.ties.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="relative">
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={winningLine}
            disabled={isGameOver}
          />

          <AnimatePresence>
            {isGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] rounded-[24px] flex flex-col items-center justify-center p-6 text-white text-center z-10"
              >
                <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl max-w-xs w-full flex flex-col items-center gap-4">
                  {winPlayer ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Award className="w-6 h-6 animate-bounce" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-display">Winner Declared!</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Player <span className="font-bold text-slate-800">{winPlayer}</span> won the round.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-lg">
                        🤝
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-display">Draw Game!</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Flawless symmetrical defense by both contenders.
                        </p>
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleResetBoard}
                    id="btn-play-again-overlay"
                    className="w-full py-3 px-4 bg-[#6366f1] hover:bg-indigo-600 text-white font-bold font-display rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 w-full lg:w-auto justify-center">
          <div className="stat-card max-w-[170px] lg:w-[180px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">
              Player O
            </p>
            <p className="text-4xl font-black text-pink-500 font-display">
              {scores.o.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="stat-card max-w-[170px] lg:w-[180px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">
              Best Streak
            </p>
            <p className="text-4xl font-black text-emerald-600 font-display">
              {bestStreak.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-lg mt-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={handleResetScores}
              id="btn-reset-match"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-indigo-100 hover:bg-slate-800 transition-all duration-150 cursor-pointer hover:scale-102 active:scale-98"
            >
              RESET MATCH
            </button>

            {isGameOver ? (
              <button
                onClick={handleResetBoard}
                id="btn-play-again"
                className="bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-sm hover:bg-slate-50 transition-all duration-150 cursor-pointer hover:scale-102 active:scale-98"
              >
                PLAY AGAIN
              </button>
            ) : (
              <button
                onClick={handleUndo}
                disabled={moveHistory.length === 0}
                id="btn-undo"
                className="bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-sm hover:bg-slate-50 transition-all duration-150 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                UNDO MOVE
              </button>
            )}
          </div>

          <p className="text-slate-400 text-[11px] font-medium tracking-wider uppercase text-center">
            Competitive Mode • Real-time Session Synchronization Active
          </p>
        </div>
      </footer>
    </div>
  );
}
