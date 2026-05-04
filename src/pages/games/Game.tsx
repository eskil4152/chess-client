import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { WsMoveType } from "../../types/websocket/WsMoveType";
import { WsGameEndedType } from "../../types/websocket/WsGameEndedType";
import { WsGameStateType } from "../../types/websocket/WsGameStateType";

type GameSession = {
  gameId: string;
  color: "white" | "black";
};

export default function Game() {
  const { subscribe, sendJson } = useWebSocket();

  const session: GameSession = JSON.parse(sessionStorage.getItem("game")!);
  const { gameId, color } = session;

  const [game, setGame] = useState(new Chess());
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STATE") {
        const event = msg as WsGameStateType;
        const restored = new Chess();
        event.moves.forEach((m) => { try { restored.move(m); } catch {} });
        setGame(new Chess(restored.fen()));
      }

      if (msg.type === "MOVE") {
        const event = msg as WsMoveType;
        setGame((prev) => {
          const next = new Chess(prev.fen());
          try { next.move(event.move); } catch {}
          return next;
        });
      }

      if (msg.type === "GAME_ENDED") {
        const event = msg as WsGameEndedType;
        const labels: Record<string, string> = {
          WHITE_WIN: "White wins",
          BLACK_WIN: "Black wins",
          DRAW: "Draw",
        };
        setResult(labels[event.status] ?? "Game over");
      }
    });
  }, [subscribe]);

  function onPieceDrop(from: string, to: string): boolean {
    const next = new Chess(game.fen());
    try {
      const move = next.move({ from, to, promotion: "q" });
      setGame(next);
      sendJson({ type: "MOVE", gameId, move: move.from + move.to + (move.promotion ?? "") });
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div style={{ width: 500 }}>
      {result && <p>{result}</p>}
      <Chessboard
        position={game.fen()}
        boardOrientation={color}
        onPieceDrop={onPieceDrop}
        arePiecesDraggable={!result}
      />
    </div>
  );
}
