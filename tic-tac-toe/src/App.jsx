import { useState } from 'react';

const initialBoard = Array(9).fill(null);

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function Square({ value, onClick, highlight }) {
  return (
    <button
      type="button"
      className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 text-4xl font-semibold transition hover:border-slate-400 ${
        highlight ? 'bg-amber-500/20 text-amber-200 shadow-lg shadow-amber-500/10' : 'bg-slate-900'
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([initialBoard]);
  const [step, setStep] = useState(0);

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line ?? [];
  const draw = board.every(Boolean) && !winner;

  const status = winner
    ? `Winner: ${winner}`
    : draw
    ? 'Draw game'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const nextBoard = [...board];
    nextBoard[index] = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, step + 1);
    setBoard(nextBoard);
    setHistory([...newHistory, nextBoard]);
    setStep(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const restart = () => {
    setBoard(initialBoard);
    setHistory([initialBoard]);
    setStep(0);
    setXIsNext(true);
  };

  const jumpTo = (move) => {
    setStep(move);
    setBoard(history[move]);
    setXIsNext(move % 2 === 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">React + Tailwind</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Tic Tac Toe</h1>
          <p className="max-w-2xl mx-auto text-slate-400">
            Click any square to play. Use the history panel to go back in time and restart when you want a fresh game.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_260px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
            <div className="grid gap-4 sm:grid-cols-3">
              {board.map((value, index) => (
                <Square
                  key={index}
                  value={value}
                  highlight={winningLine.includes(index)}
                  onClick={() => handleClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-200 shadow-inner shadow-slate-950/20">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Game status</p>
              <p className="text-2xl font-semibold text-white">{status}</p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                onClick={restart}
              >
                Restart game
              </button>

              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">History</p>
                <div className="flex flex-col gap-2">
                  {history.map((_, move) => (
                    <button
                      type="button"
                      key={move}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                        move === step
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                      }`}
                      onClick={() => jumpTo(move)}
                    >
                      {move === 0 ? 'Go to game start' : `Go to move #${move}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
