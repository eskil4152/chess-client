import { useEffect } from "react";
import { useParams } from "react-router-dom";
import playBot from "../../features/api/playBot";

export default function PlayBot() {
  const { difficulty } = useParams<{ difficulty: string }>();

  useEffect(() => {
    if (!difficulty) return;
    void playBot(difficulty);
  }, [difficulty]);

  return (
    <div className="page">
      <p>Starting game...</p>
    </div>
  );
}
