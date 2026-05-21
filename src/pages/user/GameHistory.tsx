import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import getGameHistory from "../../features/api/getGameHistory";
import { GamePreviewType } from "../../types/http/GamePreviewType";
import GamePreviewCard from "../../components/GamePreviewCard";
import "../../styles/User.css";

export default function GameHistory() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [games, setGames] = useState<GamePreviewType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setGames([]);
    setPage(0);
    setHasMore(true);
    setError(false);
    getGameHistory(username, 0)
      .then((res) => {
        const data = (res.data ?? []) as GamePreviewType[];
        setGames(data);
        setHasMore(data.length > 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  async function loadMore() {
    if (!username) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await getGameHistory(username, nextPage);
      const data = (res.data ?? []) as GamePreviewType[];
      setGames((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length > 0);
    } catch {
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  if (!username) return <div>No username provided</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="profile">
      <div className="game-list">
        <h2 className="section-h2">{username}'s games</h2>
        {games.length > 0
          ? games.map((game: GamePreviewType) => (
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
        {hasMore && (
          <button className="btn" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}
