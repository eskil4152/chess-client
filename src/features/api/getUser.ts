import fetchJSON from "../../utils/fetchJSON";

export default async function getUser(username: string) {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/user/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
