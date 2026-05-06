import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "../styles/Game.css";

type GameCardProps = {
  game: Chess;
  result: string | null;
  color: "white" | "black";
  whiteUsername: string;
  blackUsername: string;
  whiteDrawOffer: boolean;
  blackDrawOffer: boolean;
  onPieceDrop: (from: string, to: string) => boolean;
  onDraw: () => void;
  resign: () => void;
};

export default function GameCard({
  game,
  result,
  color,
  whiteUsername,
  blackUsername,
  whiteDrawOffer,
  blackDrawOffer,
  onPieceDrop,
  onDraw,
  resign,
}: GameCardProps) {
  const isWhite = color === "white";
  const playerUsername = isWhite ? whiteUsername : blackUsername;
  const opponentUsername = isWhite ? blackUsername : whiteUsername;
  const opponentOffered = isWhite ? blackDrawOffer : whiteDrawOffer;
  const drawLabel = opponentOffered ? "Accept draw" : "Offer draw";

  return (
    <div className="game">
      <div className="game-player">{opponentUsername}</div>

      <div className="game-board-wrapper">
        {result && <p className="game-result">{result}</p>}
        <Chessboard
          position={game.fen()}
          boardOrientation={color}
          onPieceDrop={onPieceDrop}
          arePiecesDraggable={!result}
        />
      </div>

      <div className="game-player">{playerUsername}</div>

      <div className="game-actions">
        <button className="btn btn-danger" onClick={resign} disabled={!!result}>Resign</button>
        <button className="btn" onClick={onDraw} disabled={!!result}>{drawLabel}</button>
      </div>
    </div>
  );
}