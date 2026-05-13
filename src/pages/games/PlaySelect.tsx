import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import getActiveGame from "../../features/api/getActiveGame";
import "../../styles/Play.css";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function PlaySelect() {
  const { subscribe, connected } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STARTED") navigate("/game");
    });
  }, [subscribe, navigate]);

  useEffect(() => {
    if (!connected) return;
    getActiveGame().then(({ status }) => {
      if (status === 200) navigate("/game");
    });
  }, [connected, navigate]);

  return (
    <div className="page">
      <div className="play-section">
        <h2>Human</h2>
        <button className="btn btn-pill" onClick={() => navigate("/play")}>Play Human</button>
      </div>

      <div className="play-section">
        <h2>Bot</h2>
        <div className="play-bot-difficulties">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className="btn btn-pill"
              onClick={() => navigate(`/play/bot/${d.toLowerCase()}`)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
