import { GameStatus } from "../types/http/GameStatus";

type GamePreviewCardProps = {
  gameId: string;
  white: string;
  black: string;
  status: GameStatus;
};

export default function GamePreviewCard({
  gameId,
  white,
  black,
  status,
}: GamePreviewCardProps) {
  let result;

  if (status === "WHITE_WIN") result = "White won";
  else if (status === "BLACK_WIN") result = "Black won";
  else result = "Draw";

  return (
    <div key={gameId}>
      <p>White: {white}</p>
      <p>Black: {black}</p>
      <p>Result: {result}</p>
    </div>
  );
}
