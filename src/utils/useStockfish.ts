import { useEffect, useRef, useState } from "react";

type BestMove = { from: string; to: string } | null;
export type EvalScore =
  | { type: "cp"; value: number }
  | { type: "mate"; value: number }
  | null;

export default function useStockfish(
  fen: string,
  enabled: boolean,
): { bestMove: BestMove; eval: EvalScore; isAnalyzing: boolean } {
  const workerRef = useRef<Worker | null>(null);
  const turnRef = useRef<"w" | "b">("w");
  const [ready, setReady] = useState(false);
  const [bestMove, setBestMove] = useState<BestMove>(null);
  const [evalScore, setEvalScore] = useState<EvalScore>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const worker = new Worker("/stockfish-18-lite-single.js");
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<string>) => {
      const line = e.data;
      if (line === "uciok") {
        worker.postMessage("isready");
      } else if (line === "readyok") {
        setReady(true);
      } else if (line.startsWith("info") && line.includes(" score ")) {
        const flip = turnRef.current === "b" ? -1 : 1;
        const mateMatch = line.match(/score mate (-?\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (mateMatch) {
          setEvalScore({
            type: "mate",
            value: flip * parseInt(mateMatch[1], 10),
          });
        } else if (cpMatch) {
          setEvalScore({ type: "cp", value: flip * parseInt(cpMatch[1], 10) });
        }
      } else if (line.startsWith("bestmove")) {
        const token = line.split(" ")[1];
        if (token && token !== "(none)") {
          setBestMove({ from: token.slice(0, 2), to: token.slice(2, 4) });
        } else {
          setBestMove(null);
        }
        setIsAnalyzing(false);
      }
    };

    worker.postMessage("uci");

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const worker = workerRef.current;
    if (!worker || !ready) return;

    if (!enabled) {
      worker.postMessage("stop");
      setBestMove(null);
      setEvalScore(null);
      setIsAnalyzing(false);
      return;
    }

    setBestMove(null);
    setEvalScore(null);
    setIsAnalyzing(true);
    turnRef.current = (fen.split(" ")[1] as "w" | "b") ?? "w";
    worker.postMessage("stop");
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage("go depth 15");
  }, [fen, enabled, ready]);

  return { bestMove, eval: evalScore, isAnalyzing };
}
