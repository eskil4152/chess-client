import fetchJSON from "../../utils/fetchJSON";

export default async function removeFriend(username: string) {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/friends/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username: username}),
    credentials: "include",
  });
}
