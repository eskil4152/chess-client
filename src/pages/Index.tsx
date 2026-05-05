import { useAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

export default function Index() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Welcome, {user?.username}!</h2>

      <Link to="/play">
        <h3>Find game</h3>
      </Link>
    </div>
  );
}
