import fetchJSON from "../../utils/fetchJSON";

export default async function getGame(id: string) {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/games/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
