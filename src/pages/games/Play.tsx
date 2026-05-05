import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { useAuth } from "../../providers/AuthProvider";
import { WsGameStartedType } from "../../types/websocket/WsGameStartedType";
import { WsGameStateType } from "../../types/websocket/WsGameStateType";

export default function Play() {
  const { subscribe, sendJson } = useWebSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    sendJson({ type: "QUEUE" });
  }, [sendJson]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type !== "GAME_STARTED" && msg.type !== "GAME_STATE") return;
      const event = msg as WsGameStartedType | WsGameStateType;
      const color = event.whiteId === user!.userId ? "white" : "black";

      sessionStorage.setItem(
        "game",
        JSON.stringify({ gameId: event.gameId, color }),
      );
      navigate("/game");
    });
  }, [subscribe, navigate, user]);

  return <p>Searching for opponent…</p>;
}
