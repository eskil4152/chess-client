import fetchJSON from "../../utils/fetchJSON";

export default async function editProfile(field: string, newValue: string) {
  return fetchJSON(`${process.env.REACT_APP_API_URL}/api/user/edit`, {
    method: "PATCH",
    body: JSON.stringify({ field, newValue }),
    credentials: "include",
  });
}
