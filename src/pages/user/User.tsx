import { useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getUser from "../../features/api/getUser";
import { UserDataType } from "../../types/http/ProfileType";
import logout from "../../features/api/logout";
import { useAuth } from "../../providers/AuthProvider";
import "../../styles/User.css";

export default function User() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const { loading, error, response } = useLoading(
    useCallback(() => getUser(username!), [username]),
  );

  async function handleLogout() {
    await logout();
    sessionStorage.removeItem("auth");
    setUser(null);
    navigate("/login");
  }

  if (!username) return <div>No username provided</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const user = response?.data as UserDataType;

  return (
    <div className="profile">
      <div className="profile-card">
        <p className="profile-username">{user.username}</p>
        <p className="profile-elo">ELO: {user.elo}</p>
        {user.bio && <p className="profile-bio">{user.bio}</p>}
        <div className="profile-actions">
          <Link to={`/games/user?username=${user.username}`} className="btn btn-pill">Game history</Link>
        </div>
      </div>
      <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
    </div>
  );
}