import fetchJSON from "../../utils/fetchJSON";

export default async function getActiveGame(gameId: string | undefined) {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/games/active/${gameId}`, {
    credentials: "include",
  });
}
