import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import login from "../../features/api/login";
import { useAuth } from "../../providers/AuthProvider";
import { AuthType } from "../../types/http/AuthType";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import "../../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(username, password);

    if (res.status === 200) {
      const data: AuthType = await res.json();
      setUser(data);
      navigate("/");
    } else if (res.status === 401) {
      setError("Credentials not found.");
    } else {
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Log In</h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <FormInput
            placeholder="Username"
            value={username}
            onChange={setUsername}
            disabled={loading}
          />
          <FormInput
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            disabled={loading}
          />
          <Button
            type="button"
            variant="pill"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide password" : "Show password"}
          </Button>
          <Button type="submit" variant="pill" disabled={loading} fullWidth>
            {loading ? "Logging in…" : "Log In"}
          </Button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
