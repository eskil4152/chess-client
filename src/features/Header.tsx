import { useAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();

  console.log("header user: ", user);

  if (!user) return null;

  return (
    <header className="header">
      <div className="navLeft">
        <Link to="/">Home</Link>
        <Link to="/play">Play</Link>
      </div>

      <div className="navRight">
        <Link to="/user">{user.username}</Link>
      </div>
    </header>
  );
}
