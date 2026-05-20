import { useChallenge } from "../providers/ChallengeProvider";
import "../styles/Challenge.css";

export default function ChallengeOverlay() {
  const { incoming, outgoing, respondToChallenge, cancelChallenge } =
    useChallenge();

  if (!incoming && !outgoing) return null;

  return (
    <div className="challenge-overlay">
      {incoming && (
        <div className="challenge-card">
          <p className="challenge-title">
            <span className="challenge-name">{incoming.challenger}</span>{" "}
            challenges you
          </p>
          <p className="challenge-time">
            {incoming.timeControl.replace(/_/g, " ").toLowerCase()}
          </p>
          <div className="challenge-actions">
            <button
              className="btn challenge-btn-accept"
              onClick={() => respondToChallenge(true)}
            >
              Accept
            </button>
            <button
              className="btn challenge-btn-decline"
              onClick={() => respondToChallenge(false)}
            >
              Decline
            </button>
          </div>
        </div>
      )}
      {outgoing && (
        <div className="challenge-card">
          <p className="challenge-title">
            Waiting for{" "}
            <span className="challenge-name">{outgoing.receiverUsername}</span>…
          </p>
          <p className="challenge-time">
            {outgoing.timeControl.replace(/_/g, " ").toLowerCase()}
          </p>
          <div className="challenge-actions">
            <button
              className="btn challenge-btn-decline"
              onClick={cancelChallenge}
              disabled={!outgoing.challengeId}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
