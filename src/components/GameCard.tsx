import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

type GameCardProps = {
  game: Chess;
  result: string | null;
  color: "white" | "black";
  whiteUsername: string;
  blackUsername: string;
  onPieceDrop: (from: string, to: string) => boolean;
  resign: () => void;
};

export default function GameCard({
  game,
  result,
  color,
  whiteUsername,
  blackUsername,
  onPieceDrop,
  resign,
}: GameCardProps) {
  const isWhite = color === "white";
  const playerUsername = isWhite ? whiteUsername : blackUsername;
  const opponentUsername = isWhite ? blackUsername : whiteUsername;

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

      <button onClick={resign}>Resign</button>
      <button>Propose draw</button>

      <div>{playerUsername}</div>
    </div>
  );
}
