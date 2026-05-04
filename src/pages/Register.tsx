import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import login from "../features/api/login";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = await login(username, password);

    if (data.status === 200) {
      navigate("/");
    } else if (data.status === 401) {
      setError("Credentials not found.");
    } else {
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering…" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>
      </form>

      <hr />

      <Link to="/login">Log In</Link>

      {error && <p>{error}</p>}
    </div>
  );
}
