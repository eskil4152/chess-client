import { useAuth } from "../providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

type UserRole = "USER" | "TRUSTED" | "MODERATOR" | "ADMIN" | "SUPERUSER";

const ROLE_RANK: Record<UserRole, number> = {
  USER: 0,
  TRUSTED: 1,
  MODERATOR: 2,
  ADMIN: 3,
  SUPERUSER: 4,
};

type Props = {
  minRole?: UserRole;
};

export default function LockedRoute({ minRole }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (minRole && ROLE_RANK[user.userRole as UserRole] < ROLE_RANK[minRole])
    return <Navigate to="/" replace />;

  return <Outlet />;
}