import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  userId: string;
  username: string;
  userRole: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);

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
    if (!url) return;

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
      .catch(() => {});
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
