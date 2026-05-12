export default async function playBot(difficulty: string) {
  return fetch(`${process.env.REACT_APP_API_URL}/api/bot/${difficulty}`, {
    method: "POST",
    credentials: "include",
  });
}
