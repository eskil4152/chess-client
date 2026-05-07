import { getCsrfToken } from "../../utils/csrf";

export default async function joinQueue() {
  return fetch(`${process.env.REACT_APP_API_URL}/api/queue`, {
    method: "POST",
    headers: { "X-XSRF-TOKEN": getCsrfToken() },
    credentials: "include",
  });
}
