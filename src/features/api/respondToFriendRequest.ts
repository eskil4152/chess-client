import fetchJSON from "../../utils/fetchJSON";

export default async function respondToFriendRequest(id: string, accepted: boolean) {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/friends/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, accepted }),
    credentials: "include",
  });
}
