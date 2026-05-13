import fetchJSON from "../../utils/fetchJSON";

export default async function addFriend(username: string) {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/friends/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username: username}),
    credentials: "include",
  });
}
