import { useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getUser from "../../features/api/getUser";
import addFriend from "../../features/api/addFriend";
import removeFriend from "../../features/api/removeFriend";
import { UserDataType } from "../../types/http/ProfileType";
import logout from "../../features/api/logout";
import { useAuth } from "../../providers/AuthProvider";
import "../../styles/User.css";

export default function User() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

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

  const responseUser = response?.data as UserDataType;

  const isUser = username === user?.username;
  const isFriend = responseUser.isFriend;

  async function handleFriend() {
    if (isFriend) {
      await removeFriend(username!);
    } else {
      await addFriend(username!);
    }
  }

  return (
    <div className="profile">
      <div className="profile-card">
        <p className="profile-username">{responseUser.username}</p>
        <p className="profile-elo">ELO: {responseUser.elo}</p>
        {responseUser.bio && <p className="profile-bio">{responseUser.bio}</p>}
        <div className="profile-actions">
          <Link to={`/games/user?username=${responseUser.username}`} className="btn btn-pill">Game history</Link>
        </div>
      </div>

      {isUser ? (
        <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
      ) : (
        <button className="btn btn-pill" onClick={handleFriend}>
          {isFriend ? "Remove friend" : "Add friend"}
        </button>
      )}

    </div>
  );
}