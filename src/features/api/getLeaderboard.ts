export type LeaderboardCategory = "bullet" | "blitz" | "rapid" | "classical";

export default async function getLeaderboard(category: LeaderboardCategory, page = 0) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/api/leaderboard/${category}?page=${page}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
}
