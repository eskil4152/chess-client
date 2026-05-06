import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import register from "../../features/api/register";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import "../../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

    const data = await register(username, password);

    if (data.status === 201) {
      navigate("/login");
    } else if (data.status === 409) {
      setError("Username already taken.");
    } else {
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormInput placeholder="Username" value={username} onChange={setUsername} disabled={loading} />
          <FormInput type={passwordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} disabled={loading} />
          <Button type="button" variant="pill" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? "Hide password" : "Show password"}
          </Button>
          <Button type="submit" variant="pill" disabled={loading} fullWidth>
            {loading ? "Registering…" : "Register"}
          </Button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-footer">Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}