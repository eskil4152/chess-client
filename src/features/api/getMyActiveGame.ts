import fetchJSON from "../../utils/fetchJSON";

export default async function getMyActiveGame() {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/games/active`, {
    credentials: "include",
  });
}
