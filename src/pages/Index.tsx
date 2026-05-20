import { useAuth } from "../providers/AuthProvider";
import PlaySelect from "../components/PlaySelect";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Welcome, {user?.username}!</h1>

      <PlaySelect />
    </div>
  );
}
