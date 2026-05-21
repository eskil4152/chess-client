export default async function playBot(difficulty: string) {
  return fetch(`${import.meta.env.VITE_API_URL}/api/bot/${difficulty}`, {
    method: "POST",
    credentials: "include",
  });
}
