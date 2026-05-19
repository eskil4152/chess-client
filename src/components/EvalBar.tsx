import type { EvalScore } from "../utils/useStockfish";
import "../styles/EvalBar.css";

function cpToWhitePercent(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.004 * cp)) - 1);
}

function formatLabel(score: EvalScore): string {
  if (!score) return "0.0";
  if (score.type === "mate") return `M${Math.abs(score.value)}`;
  const abs = Math.abs(score.value);
  if (abs >= 10000) return score.value > 0 ? "1-0" : "0-1";
  return (abs / 100).toFixed(1);
}

type Props = { score: EvalScore };

export default function EvalBar({ score }: Props) {
  let whitePercent = 50;
  if (score) {
    if (score.type === "mate") {
      whitePercent = score.value > 0 ? 100 : 0;
    } else {
      whitePercent = cpToWhitePercent(score.value);
    }
  }

  const label = formatLabel(score);
  const whiteOnTop = whitePercent < 50;

  return (
    <div className="eval-bar">
      <div className="eval-bar-black" style={{ height: `${100 - whitePercent}%` }}>
        {whiteOnTop && <span className="eval-bar-label eval-bar-label-black">{label}</span>}
      </div>
      <div className="eval-bar-white" style={{ height: `${whitePercent}%` }}>
        {!whiteOnTop && <span className="eval-bar-label eval-bar-label-white">{label}</span>}
      </div>
    </div>
  );
}