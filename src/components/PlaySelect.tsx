import { useNavigate } from "react-router-dom";
import { TIME_CONTROLS } from "../constants/timeControls";
import "../styles/Play.css";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function PlaySelect() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="play-section">
        {TIME_CONTROLS.map(({ label, options }) => (
          <div key={label} className="play-time-group">
            <span className="label-upper play-time-group-label">{label}</span>
            <div className="play-time-controls">
              {options.map(({ value, display }) => (
                <button
                  key={value}
                  className="btn btn-pill"
                  onClick={() =>
                    navigate("/play", { state: { timeControl: value } })
                  }
                >
                  {display}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="play-section">
        <h2 className="section-h2">Bot</h2>
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
