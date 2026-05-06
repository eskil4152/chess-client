export default async function joinQueue() {
  return fetch(`${process.env.REACT_APP_API_URL}/api/queue`, {
    method: "POST",
    credentials: "include",
  });
}
