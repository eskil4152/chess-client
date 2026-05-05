import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getGameHistory from "../../features/api/getGameHistory";
import { GamePreviewType } from "../../types/http/GamePreviewType";
import GamePreviewCard from "../../components/GamePreviewCard";

export default function GameHistory() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const { loading, error, response } = useLoading(
    useCallback(() => getGameHistory(username!), [username]),
  );

  if (!username) {
    return <div>No username provided</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const gameHistory = response?.data as GamePreviewType[];

  return (
    <div>
      <p>{username}s last games</p>
      {gameHistory.length > 0
        ? gameHistory.map((game: GamePreviewType) => (
            <GamePreviewCard
              gameId={game.gameId}
              white={game.whiteUsername}
              black={game.blackUsername}
              status={game.status}
            />
          ))
        : "Player has no games :("}
    </div>
  );
}
