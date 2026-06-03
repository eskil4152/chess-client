import fetchJSON from "../../utils/fetchJSON";

export default async function getFriendRequests() {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/friends/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
