import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../providers/WebSocketProvider";
import getActiveGame from "../../features/api/getActiveGame";
import "../../styles/Play.css";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const TIME_CONTROLS = [
  {
    label: "Bullet",
    options: [
      { value: "BULLET_1_0", display: "1+0" },
      { value: "BULLET_1_1", display: "1+1" },
      { value: "BULLET_2_0", display: "2+0" },
    ],
  },
  {
    label: "Blitz",
    options: [
      { value: "BLITZ_3_0", display: "3+0" },
      { value: "BLITZ_3_2", display: "3+2" },
      { value: "BLITZ_5_0", display: "5+0" },
    ],
  },
  {
    label: "Rapid",
    options: [
      { value: "RAPID_10_0",  display: "10+0" },
      { value: "RAPID_10_5",  display: "10+5" },
      { value: "RAPID_15_0",  display: "15+0" },
      { value: "RAPID_15_10", display: "15+10" },
      { value: "RAPID_30_0",  display: "30+0" },
      { value: "RAPID_60_0",  display: "60+0" },
    ],
  },
];

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
        {TIME_CONTROLS.map(({ label, options }) => (
          <div key={label} className="play-time-group">
            <span className="play-time-group-label">{label}</span>
            <div className="play-time-controls">
              {options.map(({ value, display }) => (
                <button
                  key={value}
                  className="btn btn-pill"
                  onClick={() => navigate("/play", { state: { timeControl: value } })}
                >
                  {display}
                </button>
              ))}
            </div>
          </div>
        ))}
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