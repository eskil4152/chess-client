import React, { useEffect, useState } from "react";
import getLeaderboard, { LeaderboardCategory } from "../features/api/getLeaderboard";
import { LeaderboardPlayerDTO } from "../types/http/LeaderboardType";
import Button from "../components/Button";
import "../styles/Leaderboard.css";

const CATEGORIES: { label: string; value: LeaderboardCategory }[] = [
  { label: "Bullet", value: "bullet" },
  { label: "Blitz", value: "blitz" },
  { label: "Rapid", value: "rapid" },
  { label: "Classical", value: "classical" },
];

export default function Leaderboard() {
  const [category, setCategory] = useState<LeaderboardCategory>("bullet");
  const [page, setPage] = useState(0);
  const [players, setPlayers] = useState<LeaderboardPlayerDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard(category, page)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPlayers(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [category, page]);

  function handleCategory(val: LeaderboardCategory) {
    setCategory(val);
    setPage(0);
  }

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>

      <div className="leaderboard-tabs">
        {CATEGORIES.map(({ label, value }) => (
          <Button
            key={value}
            variant="default"
            onClick={() => handleCategory(value)}
            fullWidth
            active={category === value}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="leaderboard-table-wrap card">
        {loading ? (
          <p style={{ padding: "16px", margin: 0, opacity: 0.6 }}>Loading…</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th>Player</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Win %</th>
                <th className="col-elo">Elo</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id}>
                  <td className="col-rank">{page * players.length + i + 1}</td>
                  <td>{p.username}</td>
                  <td>{p.games}</td>
                  <td>{p.wins}</td>
                  <td>{p.winPercentage}%</td>
                  <td className="col-elo">{p.elo}</td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", opacity: 0.5 }}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="leaderboard-pagination">
        <Button variant="default" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Prev
        </Button>
        <span>Page {page + 1}</span>
        <Button variant="default" onClick={() => setPage((p) => p + 1)} disabled={players.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
}
