import { getCsrfToken } from "../../utils/csrf";

export default async function login(username: string, password: string) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getCsrfToken(),
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  });
}
