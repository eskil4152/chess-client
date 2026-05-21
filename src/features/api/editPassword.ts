import fetchJSON from "../../utils/fetchJSON";

export default async function editPassword(
  oldPassword: string,
  newPassword: string,
) {
  return fetchJSON(`${import.meta.env.VITE_API_URL}/api/user/edit-password`, {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
    credentials: "include",
  });
}
