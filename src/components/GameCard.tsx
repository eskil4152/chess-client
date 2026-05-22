import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "../styles/Game.css";

type GameCardProps = {
  game: Chess;
  result: string | null;
  color: "white" | "black" | null;
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
  const isBlack = color === "black";
  const bottomUsername = isBlack ? blackUsername : whiteUsername;
  const topUsername = isBlack ? whiteUsername : blackUsername;
  const bottomElo = isBlack ? blackElo : whiteElo;
  const topElo = isBlack ? whiteElo : blackElo;
  const bottomEloChange = isBlack ? blackEloChange : whiteEloChange;
  const topEloChange = isBlack ? whiteEloChange : blackEloChange;
  const bottomMs = isBlack ? blackMs : whiteMs;
  const topMs = isBlack ? whiteMs : blackMs;
  const opponentOffered = isBlack ? whiteDrawOffer : blackDrawOffer;
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
            to={`/user?username=${topUsername}`}
          >
            {topUsername}
          </Link>{" "}
          -{" "}
          {topEloChange !== null ? topElo + topEloChange : topElo}{" "}
          {topEloChange !== null && (
            <span>({formatEloChange(topEloChange)})</span>
          )}
        </span>
        {topMs !== null && (
          <span className="game-clock">{formatMs(topMs)}</span>
        )}
      </div>

      <div className="game-board-wrapper">
        {result && <p className="game-result">{result}</p>}
        <Chessboard
          position={game.fen()}
          boardOrientation={color ?? "white"}
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
            to={`/user?username=${bottomUsername}`}
          >
            {bottomUsername}
          </Link>{" "}
          - {bottomEloChange !== null ? bottomElo + bottomEloChange : bottomElo}{" "}
          {bottomEloChange !== null && (
            <span>({formatEloChange(bottomEloChange)})</span>
          )}
        </span>
        {bottomMs !== null && (
          <span className="game-clock">{formatMs(bottomMs)}</span>
        )}
      </div>

      <div className="game-actions">
        {color ? (
          <>
            <button
              className="btn btn-danger"
              onClick={resign}
              disabled={!!result}
            >
              Resign
            </button>
            <button className="btn" onClick={onDraw} disabled={!!result}>
              {drawLabel}
            </button>
          </>
        ) : (
          <span className="label-upper">Spectating</span>
        )}
      </div>
    </div>
  );
}
