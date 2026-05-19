import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "../providers/ChallengeProvider";
import { TIME_CONTROLS } from "../constants/timeControls";
import "../styles/Friends.css";
import "../styles/Challenge.css";

type FriendCardProps = {
  userId: string;
  username: string;
  bio: string;
  avatar: string;
};

export default function FriendCard({ userId, username, bio, avatar }: FriendCardProps) {
  const navigate = useNavigate();
  const { sendChallenge, outgoing } = useChallenge();
  const [picking, setPicking] = useState(false);

  const hasPendingChallenge = outgoing?.receiverUsername === username;

  function handleChallenge(e: React.MouseEvent) {
    e.stopPropagation();
    if (hasPendingChallenge) return;
    setPicking((v) => !v);
  }

  function selectTimeControl(e: React.MouseEvent, timeControl: string) {
    e.stopPropagation();
    sendChallenge(userId, username, timeControl);
    setPicking(false);
  }

  return (
    <div className="friend-card" onClick={() => navigate(`/user?username=${username}`)}>
      <img src={avatar || "/default_profile.png"} alt={username} className="friend-card-avatar" />
      <div className="friend-card-info">
        <span className="friend-card-username">{username}</span>
        {bio && <span className="friend-card-bio">{bio}</span>}
        <button
          className="btn btn-pill"
          style={{ marginTop: 8, padding: "5px 14px", fontSize: "0.8rem" }}
          onClick={handleChallenge}
          disabled={hasPendingChallenge}
        >
          {hasPendingChallenge ? "Challenge sent" : "Challenge"}
        </button>
        {picking && (
          <div className="friend-card-challenge" onClick={(e) => e.stopPropagation()}>
            {TIME_CONTROLS.map(({ label, options }) => (
              <div key={label} className="friend-card-time-group">
                <span className="friend-card-time-group-label">{label}</span>
                <div className="friend-card-time-controls">
                  {options.map(({ value, display }) => (
                    <button key={value} className="btn btn-pill" onClick={(e) => selectTimeControl(e, value)}>
                      {display}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}