import fetchJSON from "../../utils/fetchJSON";

export default async function getActiveGame() {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/games/active`, {
    credentials: "include",
  });
}
