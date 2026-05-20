import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "../styles/Game.css";

type GameCardProps = {
  game: Chess;
  result: string | null;
  color: "white" | "black";
  whiteUsername: string;
  blackUsername: string;
  whiteElo: number;
  blackElo: number;
  whiteEloChange: number | null;
  blackEloChange: number | null;
  whiteMs: number | null;
  blackMs: number | null;
  whiteDrawOffer: boolean;
  blackDrawOffer: boolean;
  selectedSquare: string | null;
  lastMove: { from: string; to: string } | null;
  onPieceDrop: (from: string, to: string) => boolean;
  onSquareClick: (square: string) => void;
  onDraw: () => void;
  resign: () => void;
};

function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatEloChange(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}

export default function GameCard({
  game,
  result,
  color,
  whiteUsername,
  blackUsername,
  whiteElo,
  blackElo,
  whiteEloChange,
  blackEloChange,
  whiteMs,
  blackMs,
  whiteDrawOffer,
  blackDrawOffer,
  selectedSquare,
  lastMove,
  onPieceDrop,
  onSquareClick,
  onDraw,
  resign,
}: GameCardProps) {
  const isWhite = color === "white";
  const playerUsername = isWhite ? whiteUsername : blackUsername;
  const opponentUsername = isWhite ? blackUsername : whiteUsername;
  const playerElo = isWhite ? whiteElo : blackElo;
  const opponentElo = isWhite ? blackElo : whiteElo;
  const playerEloChange = isWhite ? whiteEloChange : blackEloChange;
  const opponentEloChange = isWhite ? blackEloChange : whiteEloChange;
  const playerMs = isWhite ? whiteMs : blackMs;
  const opponentMs = isWhite ? blackMs : whiteMs;
  const opponentOffered = isWhite ? blackDrawOffer : whiteDrawOffer;
  const drawLabel = opponentOffered ? "Accept draw" : "Offer draw";

  const [dragOrigin, setDragOrigin] = useState<string | null>(null);

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    squareStyles[lastMove.from] = {
      backgroundColor: "rgba(100, 200, 100, 0.45)",
    };
    squareStyles[lastMove.to] = {
      backgroundColor: "rgba(100, 200, 100, 0.45)",
    };
  }
  if (selectedSquare) {
    squareStyles[selectedSquare] = {
      backgroundColor: "rgba(255, 255, 100, 0.55)",
    };
  }
  if (dragOrigin) {
    squareStyles[dragOrigin] = { backgroundColor: "rgba(255, 255, 100, 0.55)" };
  }
  if (game.inCheck()) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const turnColor = game.turn();
    game.board().forEach((row, ri) =>
      row.forEach((sq, fi) => {
        if (sq?.type === "k" && sq.color === turnColor)
          squareStyles[files[fi] + (8 - ri)] = {
            backgroundColor: "rgba(220, 50, 50, 0.65)",
          };
      }),
    );
  }

  return (
    <div className="game">
      <div className="game-player">
        <span>
          <Link
            className="game-player-link"
            to={`/user?username=${opponentUsername}`}
          >
            {opponentUsername}
          </Link>{" "}
          -{" "}
          {opponentEloChange !== null
            ? opponentElo + opponentEloChange
            : opponentElo}{" "}
          {opponentEloChange !== null && (
            <span>({formatEloChange(opponentEloChange)})</span>
          )}
        </span>
        {opponentMs !== null && (
          <span className="game-clock">{formatMs(opponentMs)}</span>
        )}
      </div>

      <div className="game-board-wrapper">
        {result && <p className="game-result">{result}</p>}
        <Chessboard
          position={game.fen()}
          boardOrientation={color}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          onPieceDragBegin={(_piece, square) => setDragOrigin(square)}
          onPieceDragEnd={() => setDragOrigin(null)}
          customSquareStyles={squareStyles}
          arePiecesDraggable={!result}
        />
      </div>

      <div className="game-player">
        <span>
          <Link
            className="game-player-link"
            to={`/user?username=${playerUsername}`}
          >
            {playerUsername}
          </Link>{" "}
          - {playerEloChange !== null ? playerElo + playerEloChange : playerElo}{" "}
          {playerEloChange !== null && (
            <span>({formatEloChange(playerEloChange)})</span>
          )}
        </span>
        {playerMs !== null && (
          <span className="game-clock">{formatMs(playerMs)}</span>
        )}
      </div>

      <div className="game-actions">
        <button className="btn btn-danger" onClick={resign} disabled={!!result}>
          Resign
        </button>
        <button className="btn" onClick={onDraw} disabled={!!result}>
          {drawLabel}
        </button>
      </div>
    </div>
  );
}
