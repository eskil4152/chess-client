import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import joinQueue from "../../features/api/joinQueue";
import leaveQueue from "../../features/api/leaveQueue";
import getActiveGame from "../../features/api/getActiveGame";

export default function Play() {
  const { subscribe } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    getActiveGame().then(({ status }) => {
      if (status === 200) { navigate("/game"); return; }
      joinQueue().then((res) => {
        if (res.status === 409) navigate("/game");
      });
    });
    return () => {
      void leaveQueue();
    };
  }, [navigate]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STARTED") navigate("/game");
    });
  }, [subscribe, navigate]);

  return <p>Searching for opponent…</p>;
}
