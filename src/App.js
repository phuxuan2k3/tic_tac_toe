import { useState } from "react";
import cross_icon from "./Assets/cross.png";
import circle_icon from "./Assets/circle.png";

function Square({ color, value, onSquareClick }) {
  let valueImg = null;
  if (value === "X") {
    valueImg = <img alt="" src={cross_icon}></img>;
  } else if (value === "O") {
    valueImg = <img alt="" src={circle_icon}></img>;
  }
  return (
    <button
      style={{ borderColor: color }}
      className="square"
      onClick={onSquareClick}
    >
      {valueImg}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay({
      board: nextSquares,
      location: { x: Math.floor(i / boardSize), y: i % boardSize },
    });
  }

  const matchResult = calculateWinner(squares);
  const winner = matchResult ? matchResult.winner : null;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (currentMove === 9) {
    status = "Draw - no one wins";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const track = matchResult ? matchResult.track : null;
  const boardSize = 3;
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    let rows = [];
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j;
      let color = "black";
      if (track && track.includes(index)) {
        if (winner === "X") {
          color = "green";
        } else {
          color = "blue";
        }
      }
      rows.push(
        <Square
          key={index}
          color={color}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        ></Square>
      );
    }
    board.push(
      <div key={i} className="board-row">
        {rows}
      </div>
    );
  }

  return (
    <>
      <div
        className="status"
        style={{ color: status.includes("X") ? "#26ffcb" : "#d9cb08" }}
      >
        {status}
      </div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { board: Array(9).fill(null), location: { x: null, y: null } },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].board;
  const [isAscendingMoves, setIsAscendingMoves] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((his, move) => {
    let description;
    if (move === history.length - 1 && move > 0) {
      description = `You are at move #${move}`;
      return (
        <li key={move}>
          <span className="cur-move">
            {" "}
            {description} at ({his.location.x},{his.location.y})
          </span>
        </li>
      );
    } else if (move > 0) {
      description =
        "Go to move #" +
        move +
        " at " +
        `(${his.location.x},${his.location.y})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button className="move" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  if (!isAscendingMoves) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          currentMove={currentMove}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button
          className="sort-move"
          onClick={() => setIsAscendingMoves(!isAscendingMoves)}
        >
          Sort {isAscendingMoves ? "Ascending" : "Descending"}
        </button>
        <ol style={{ listStyleType: "none" }}>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], track: [a, b, c] };
    }
  }
  return null;
}
