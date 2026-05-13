import { getCsrfToken } from "../../utils/csrf";

export default async function joinQueue(timeControl: string) {
  return fetch(`${process.env.REACT_APP_API_URL}/api/queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getCsrfToken(),
    },
    credentials: "include",
    body: JSON.stringify({ timeControl }),
  });
}
