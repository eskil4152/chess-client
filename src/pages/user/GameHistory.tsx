import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getGameHistory from "../../features/api/getGameHistory";
import { GamePreviewType } from "../../types/http/GamePreviewType";
import GamePreviewCard from "../../components/GamePreviewCard";
import "../../styles/User.css";

export default function GameHistory() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const { loading, error, response } = useLoading(
    useCallback(() => getGameHistory(username!), [username]),
  );

  if (!username) return <div>No username provided</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const gameHistory = response?.data as GamePreviewType[];

  return (
    <div className="profile">
      <div className="game-list">
        <h2>{username}'s games</h2>
        {gameHistory.length > 0
          ? gameHistory.map((game: GamePreviewType) => (
              <GamePreviewCard
                key={game.gameId}
                gameId={game.gameId}
                white={game.whiteUsername}
                black={game.blackUsername}
                status={game.status}
                user={username}
              />
            ))
          : "No games yet."}
      </div>
    </div>
  );
}
