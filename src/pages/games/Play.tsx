import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import joinQueue from "../../features/api/joinQueue";
import leaveQueue from "../../features/api/leaveQueue";
import getActiveGame from "../../features/api/getActiveGame";

const DOTS = [".", "..", "..."];

export default function Play() {
  const { subscribe, connected } = useWebSocket();
  const navigate = useNavigate();
  const { state } = useLocation();
  const timeControl: string = state?.timeControl ?? "BLITZ_5_0";
  const [dotIndex, setDotIndex] = useState(0);
  const joinedRef = useRef(false);

  useEffect(() => {
    getActiveGame().then(({ status }) => {
      if (status === 200) {
        navigate("/game");
        return;
      }
      joinQueue(timeControl).then((res) => {
        if (res.status === 409) {
          navigate("/game");
          return;
        }
        joinedRef.current = true;
      });
    });
    return () => {
      void leaveQueue();
    };
  }, [navigate, timeControl]);

  useEffect(() => {
    if (!connected || !joinedRef.current) return;
    getActiveGame().then(({ status }) => {
      if (status === 200) navigate("/game");
    });
  }, [connected, navigate]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STARTED") navigate("/game");
    });
  }, [subscribe, navigate]);

  useEffect(() => {
    const id = setInterval(
      () => setDotIndex((i) => (i + 1) % DOTS.length),
      500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page">
      <p>Searching for opponent{DOTS[dotIndex]}</p>
      <button className="btn" onClick={() => navigate("/play/select")}>
        Cancel
      </button>
    </div>
  );
}
