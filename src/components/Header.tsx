import { useAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="header">
      <div className="headerLeft">
        <Link to="/">Home</Link>
      </div>

      <div className="headerCenter">
        <Link to={"/game"}>
          <button className="header-game-btn">GAME</button>
        </Link>
      </div>

      <div className="headerRight">
        <Link to="/friends">Friends</Link>
        <Link to={`/user?username=${user.username}`}>{user.username}</Link>
      </div>
    </header>
  );
}
