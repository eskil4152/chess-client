import React, { useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import useLoading from "../../utils/useLoading";
import useStockfish, { EvalScore } from "../../utils/useStockfish";
import EvalBar from "../../components/EvalBar";
import getGame from "../../features/api/getGame";
import { GameType } from "../../types/http/GameType";
import "../../styles/Game.css";
import "../../styles/GameReplay.css";

const resultLabel: Record<string, string> = {
  WHITE_WIN: "White wins",
  BLACK_WIN: "Black wins",
  DRAW: "Draw",
};

function GameReplayBoard({ gameData }: { gameData: GameType }) {
  const [step, setStep] = useState(0);
  const [analyzeEnabled, setAnalyzeEnabled] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const master = new Chess();
  try {
    master.loadPgn(gameData.moves);
  } catch {}
  const history = master.history({ verbose: true });
  const totalMoves = history.length;

  const chess = new Chess();
  for (let i = 0; i < step; i++) {
    try {
      chess.move(history[i]);
    } catch {}
  }

  const isGameOver = chess.isGameOver();

  const {
    bestMove,
    eval: engineEval,
    isAnalyzing,
  } = useStockfish(chess.fen(), analyzeEnabled && !isGameOver);

  const evalScore: EvalScore = (() => {
    if (!analyzeEnabled) return null;
    if (isGameOver) {
      if (gameData.status === "WHITE_WIN") return { type: "cp", value: 10000 };
      if (gameData.status === "BLACK_WIN") return { type: "cp", value: -10000 };
      return null;
    }
    return engineEval;
  })();

  const lastMove =
    step > 0
      ? { from: history[step - 1].from, to: history[step - 1].to }
      : null;

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    squareStyles[lastMove.from] = {
      backgroundColor: "rgba(100, 200, 100, 0.45)",
    };
    squareStyles[lastMove.to] = {
      backgroundColor: "rgba(100, 200, 100, 0.45)",
    };
  }
  if (chess.inCheck()) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const turnColor = chess.turn();
    chess.board().forEach((row, ri) =>
      row.forEach((sq, fi) => {
        if (sq?.type === "k" && sq.color === turnColor)
          squareStyles[files[fi] + (8 - ri)] = {
            backgroundColor: "rgba(220, 50, 50, 0.65)",
          };
      }),
    );
  }

  const arrows: [Square, Square, string][] = bestMove
    ? [
        [
          bestMove.from as Square,
          bestMove.to as Square,
          "rgba(0, 128, 255, 0.75)",
        ],
      ]
    : [];

  return (
    <div className="game">
      <div className="game-player">
        <Link
          className="game-player-link"
          to={`/user?username=${flipped ? gameData.whiteUsername : gameData.blackUsername}`}
        >
          {flipped ? gameData.whiteUsername : gameData.blackUsername}
        </Link>
      </div>

      <div className="game-replay-board-row">
        {analyzeEnabled && <EvalBar score={evalScore} flipped={flipped} />}
        <div className="game-board-wrapper">
          {step === totalMoves && (
            <p className="game-result">
              {resultLabel[gameData.status] ?? "Game over"}
            </p>
          )}
          <Chessboard
            position={chess.fen()}
            boardOrientation={flipped ? "black" : "white"}
            arePiecesDraggable={false}
            customSquareStyles={squareStyles}
            customArrows={arrows}
          />
        </div>
      </div>

      <div className="game-player">
        <Link
          className="game-player-link"
          to={`/user?username=${flipped ? gameData.blackUsername : gameData.whiteUsername}`}
        >
          {flipped ? gameData.blackUsername : gameData.whiteUsername}
        </Link>
      </div>

      <div className="game-replay-controls">
        <button
          className="btn"
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          {"<<"}
        </button>
        <button
          className="btn"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {"<"}
        </button>
        <span className="game-replay-counter">
          {step} / {totalMoves}
        </span>
        <button
          className="btn"
          onClick={() => setStep((s) => Math.min(totalMoves, s + 1))}
          disabled={step === totalMoves}
        >
          {">"}
        </button>
        <button
          className="btn"
          onClick={() => setStep(totalMoves)}
          disabled={step === totalMoves}
        >
          {">>"}
        </button>
        <button className="btn" onClick={() => setFlipped((v) => !v)}>
          Flip
        </button>
        <button
          className={`btn ${analyzeEnabled ? "btn-active" : ""}`}
          onClick={() => setAnalyzeEnabled((v) => !v)}
        >
          {analyzeEnabled
            ? isAnalyzing
              ? "Analyzing…"
              : "Analysis on"
            : "Analyze"}
        </button>
      </div>
    </div>
  );
}

export default function GameReplay() {
  const { id } = useParams<{ id: string }>();

  const { loading, error, response } = useLoading(
    useCallback(() => getGame(id!), [id]),
  );

  if (loading) return <div>Loading...</div>;
  if (error || !response?.data) return <div>Game not found</div>;

  return <GameReplayBoard gameData={response.data as GameType} />;
}
