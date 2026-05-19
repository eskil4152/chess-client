import { Link } from "react-router-dom";
import { GameStatus } from "../types/http/GameStatus";

type GamePreviewCardProps = {
  gameId: string;
  white: string;
  black: string;
  status: GameStatus;
  user: string;
};

export default function GamePreviewCard({
  gameId,
  white,
  black,
  status,
  user,
}: GamePreviewCardProps) {
  let result;

  if (status === "DRAW") {
    result = "DRAW";
  } else if (status === "WHITE_WIN") {
    result = white === user ? "VICTORY" : "LOSS";
  } else {
    result = black === user ? "VICTORY" : "LOSS";
  }

  return (
    <Link to={`/games/${gameId}`} className="game-card-link">
      <div className="game-card">
        <div className="game-card-players">
          <span>White: {white}</span>
          <span>Black: {black}</span>
        </div>
        <span className="game-card-result">{result}</span>
      </div>
    </Link>
  );
}
