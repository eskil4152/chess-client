export default async function leaveQueue() {
  return fetch(`${import.meta.env.VITE_API_URL}/api/queue`, {
    method: "DELETE",
    credentials: "include",
  });
}
