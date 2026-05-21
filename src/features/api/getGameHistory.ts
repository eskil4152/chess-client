import fetchJSON from "../../utils/fetchJSON";

export default async function getGameHistory(username: string, page = 0) {
  return fetchJSON(
    `${process.env.REACT_APP_API_URL}/api/games/user/${username}?page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
}
