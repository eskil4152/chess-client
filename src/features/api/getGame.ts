import fetchJSON from "../../utils/fetchJSON";

export default async function getGame(id: string) {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/games/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
