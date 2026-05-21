import fetchJSON from "../../utils/fetchJSON";

export default async function getFriends() {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
