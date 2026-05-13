import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import playBot from "../../features/api/playBot";

export default function PlayBot() {
  const { subscribe } = useWebSocket();
  const navigate = useNavigate();
  const { difficulty } = useParams<{ difficulty: string }>();

  useEffect(() => {
    if (!difficulty) return;
    void playBot(difficulty);
  }, [difficulty]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STARTED") navigate("/game");
    });
  }, [subscribe, navigate]);

  return (
    <div className="page">
      <p>Starting game...</p>
    </div>
  );
}
