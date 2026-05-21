export default async function logout() {
  return await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
