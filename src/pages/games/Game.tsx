import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { WsMoveType } from "../../types/websocket/WsMoveType";
import { WsGameEndedType } from "../../types/websocket/WsGameEndedType";
import { WsGameStateType } from "../../types/websocket/WsGameStateType";
import GameCard from "../../components/GameCard";

type GameSession = {
  gameId: string;
  color: "white" | "black";
};

export default function Game() {
  const { subscribe, sendJson } = useWebSocket();

  const session: GameSession = JSON.parse(sessionStorage.getItem("game")!);
  const { gameId, color } = session;

  const [game, setGame] = useState(new Chess());
  const [players, setPlayers] = useState<{
    white: string;
    black: string;
  } | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "GAME_STATE") {
        const event = msg as WsGameStateType;
        setPlayers({ white: event.whiteUsername, black: event.blackUsername });
        const restored = new Chess();
        event.moves.forEach((m) => {
          try {
            restored.move(m);
          } catch {}
        });
        setGame(new Chess(restored.fen()));
      }

      if (msg.type === "MOVE") {
        const event = msg as WsMoveType;
        setGame((prev) => {
          const next = new Chess(prev.fen());
          try {
            next.move(event.move);
          } catch {}
          return next;
        });
      }

      if (msg.type === "GAME_ENDED") {
        const event = msg as WsGameEndedType;
        const winner: Record<string, string> = {
          WHITE_WIN: "White wins",
          BLACK_WIN: "Black wins",
        };
        if (event.status === "DRAW") {
          setResult(`Draw by ${event.endedBy}`);
        } else {
          setResult(`${winner[event.status] ?? "Game over"} by ${event.endedBy}`);
        }
      }
    });
  }, [subscribe]);

  function onPieceDrop(from: string, to: string): boolean {
    const next = new Chess(game.fen());
    try {
      const move = next.move({ from, to, promotion: "q" });
      setGame(next);
      sendJson({
        type: "MOVE",
        gameId,
        move: move.from + move.to + (move.promotion ?? ""),
      });
      return true;
    } catch {
      return false;
    }
  }

  function resign() {
    try {
      sendJson({
        type: "RESIGN",
        gameId,
      });
      return true;
    } catch {
      // foobar
    }
  }

  return (
    <GameCard
      game={game}
      result={result}
      color={color}
      whiteUsername={players != null ? players.white : "White"}
      blackUsername={players != null ? players.black : "Black"}
      onPieceDrop={onPieceDrop}
      resign={resign}
    />
  );
}
