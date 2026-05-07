import { getCsrfToken } from "../../utils/csrf";

export default async function leaveQueue() {
  return fetch(`${process.env.REACT_APP_API_URL}/api/queue`, {
    method: "DELETE",
    headers: { "X-XSRF-TOKEN": getCsrfToken() },
    credentials: "include",
  });
}
