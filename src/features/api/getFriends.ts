import fetchJSON from "../../utils/fetchJSON";

export default async function getFriends() {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
