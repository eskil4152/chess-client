import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import getActiveGame from "../features/api/getActiveGame";
import "../styles/Header.css";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [noGame, setNoGame] = useState(false);

  if (!user) return null;

  async function handleGame() {
    setNoGame(false);
    const { status } = await getActiveGame();
    if (status === 200) {
      navigate("/game");
    } else {
      setNoGame(true);
      setTimeout(() => setNoGame(false), 3000);
    }
  }

  return (
    <header className="header">
      <div className="headerLeft">
        <Link to="/">Home</Link>
      </div>

      <div className="headerCenter">
        <button className="header-game-btn" onClick={handleGame}>GAME</button>
        {noGame && <span className="header-no-game">No active game</span>}
      </div>

      <div className="headerRight">
        <Link to="/friends">Friends</Link>
        <Link to={`/user?username=${user.username}`}>{user.username}</Link>
      </div>
    </header>
  );
}
