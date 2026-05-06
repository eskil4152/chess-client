import { useAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Welcome, {user?.username}!</h1>
      <Link to="/play" className="btn">Find game</Link>
    </div>
  );
}
