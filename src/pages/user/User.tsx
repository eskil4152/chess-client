import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getUser from "../../features/api/getUser";
import { UserDataType } from "../../types/http/ProfileType";
import logout from "../../features/api/logout";
import { useAuth } from "../../providers/AuthProvider";

export default function User() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const { loading, error, response } = useLoading(
    () => getUser(username!),
    [username],
  );

  async function handleLogout() {
    await logout();
    sessionStorage.removeItem("auth");
    setUser(null);
    navigate("/login");
  }

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

      <Link to={`/games/user?username=${user.username}`}>Games history</Link>

      <br />

      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
