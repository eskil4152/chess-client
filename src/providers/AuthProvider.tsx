import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthType } from "../types/http/AuthType";

type AuthContextType = {
  user: AuthType | null;
  setUser: (user: AuthType | null) => void;
  loading: boolean;
  serverOffline: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthType | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverOffline, setServerOffline] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("auth");
      }
    }

    const url = process.env.REACT_APP_API_URL;
    if (!url) {
      setLoading(false);
      return;
    }

    fetch(`${url}/api/auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          sessionStorage.setItem("auth", JSON.stringify(data));
          setUser(data);
        } else {
          setUser(null);
          sessionStorage.removeItem("auth");
        }
      })
      .catch(() => {
        setServerOffline(true);
        navigate("/server-offline", { replace: true });
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ user, setUser, loading, serverOffline }), [user, loading, serverOffline]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
