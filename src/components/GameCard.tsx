import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

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
    <div>
      <div>{opponentUsername}</div>

      <div style={{ width: 500 }}>
        {result && <p>{result}</p>}
        <Chessboard
          position={game.fen()}
          boardOrientation={color}
          onPieceDrop={onPieceDrop}
          arePiecesDraggable={!result}
        />
      </div>

      <button onClick={resign} disabled={!!result}>Resign</button>
      <button onClick={onDraw} disabled={!!result}>{drawLabel}</button>

      <div>{playerUsername}</div>
    </div>
  );
}
