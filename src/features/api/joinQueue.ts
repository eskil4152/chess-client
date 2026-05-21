export default async function joinQueue(timeControl: string) {
  return fetch(`${import.meta.env.VITE_API_URL}/api/queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ timeControl }),
  });
}
