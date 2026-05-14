import fetchJSON from "../../utils/fetchJSON";

export default async function editPassword(oldPassword: string, newPassword: string) {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/user/edit-password`, {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
    credentials: "include",
  });
}
