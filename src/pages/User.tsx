import { useSearchParams } from "react-router-dom";
import useLoading from "../utils/useLoading";
import getUser from "../features/api/getUser";
import { UserDataType } from "../types/UserType";

export default function User() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const { loading, error, response } = useLoading(
    () => getUser(username!),
    [username],
  );

  if (!username) {
    return <div>No username provided</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const user = response?.data as UserDataType;

  return (
    <div>
      <p>User page</p>
      {user?.username}

      <p>Biography</p>
      {user?.bio}

      <p>ELO</p>
      {user?.elo}
    </div>
  );
}
