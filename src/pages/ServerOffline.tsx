import { useCallback, useEffect } from "react";

export default function ServerOffline() {
  const url = process.env.REACT_APP_API_URL;

  const check = useCallback(async () => {
    try {
      await fetch(`${url}/api/auth`, { credentials: "include" });
      window.location.replace("/");
    } catch {}
  }, [url]);

  useEffect(() => {
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [check]);

  return (
    <div className="page">
      <p>Server is temporarily offline.</p>
      <button className="btn" onClick={check}>
        Try again
      </button>
    </div>
  );
}
