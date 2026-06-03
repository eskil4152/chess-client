import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { useWebSocket } from "../providers/WebSocketProvider";
import "../styles/Header.css";

export default function Header() {
  const { user } = useAuth();
  const { pendingRequestCount, clearPendingRequests } = useWebSocket();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/friends") clearPendingRequests();
  }, [location.pathname, clearPendingRequests]);

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
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/friends" className="header-friends-link">
          Friends
          {pendingRequestCount > 0 && (
            <span className="header-request-badge">{pendingRequestCount}</span>
          )}
        </Link>
        <Link to={`/user?username=${user.username}`}>{user.username}</Link>
      </div>
    </header>
  );
}
