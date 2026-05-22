import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import joinQueue from "../../features/api/joinQueue";
import leaveQueue from "../../features/api/leaveQueue";

const DOTS = [".", "..", "..."];

export default function Play() {
  const { subscribe } = useWebSocket();
  const navigate = useNavigate();
  const { state } = useLocation();
  const timeControl: string = state?.timeControl ?? "BLITZ_5_0";
  const [dotIndex, setDotIndex] = useState(0);
  const joinedRef = useRef(false);
  const matchedRef = useRef(false);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STARTED") matchedRef.current = true;
    });
  }, [subscribe]);

  useEffect(() => {
    joinQueue(timeControl).then((res) => {
      if (res.ok) joinedRef.current = true;
    });
    return () => {
      if (!matchedRef.current) void leaveQueue();
    };
  }, [timeControl]);

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
