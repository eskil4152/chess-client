import React from "react";
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
  whiteDrawOffer: boolean;
  blackDrawOffer: boolean;
  selectedSquare: string | null;
  lastMove: { from: string; to: string } | null;
  onPieceDrop: (from: string, to: string) => boolean;
  onSquareClick: (square: string) => void;
  onDraw: () => void;
  resign: () => void;
};

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
  const opponentOffered = isWhite ? blackDrawOffer : whiteDrawOffer;
  const drawLabel = opponentOffered ? "Accept draw" : "Offer draw";

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    squareStyles[lastMove.from] = { backgroundColor: "rgba(100, 200, 100, 0.45)" };
    squareStyles[lastMove.to] = { backgroundColor: "rgba(100, 200, 100, 0.45)" };
  }
  if (selectedSquare) {
    squareStyles[selectedSquare] = { backgroundColor: "rgba(255, 255, 100, 0.55)" };
  }

  return (
    <div className="game">
      <div className="game-player">
        {opponentUsername} - {opponentEloChange !== null ? opponentElo + opponentEloChange : opponentElo} {opponentEloChange !== null && <span> ({formatEloChange(opponentEloChange)})</span>}
      </div>

      <div className="game-board-wrapper">
        {result && <p className="game-result">{result}</p>}
        <Chessboard
          position={game.fen()}
          boardOrientation={color}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={squareStyles}
          arePiecesDraggable={!result}
        />
      </div>

      <div className="game-player">
        {playerUsername} - {playerEloChange !== null ? playerElo + playerEloChange : playerElo} {playerEloChange !== null && <span> ({formatEloChange(playerEloChange)})</span>}
      </div>

      <div className="game-actions">
        <button className="btn btn-danger" onClick={resign} disabled={!!result}>Resign</button>
        <button className="btn" onClick={onDraw} disabled={!!result}>{drawLabel}</button>
      </div>
    </div>
  );
}