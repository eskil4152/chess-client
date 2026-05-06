import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { useAuth } from "../../providers/AuthProvider";
import { WsMoveType } from "../../types/websocket/WsMoveType";
import { WsGameEndedType } from "../../types/websocket/WsGameEndedType";
import { GameStateType } from "../../types/http/GameStateType";
import GameCard from "../../components/GameCard";
import getActiveGame from "../../features/api/getActiveGame";

export default function Game() {
  const { subscribe, sendJson, connected } = useWebSocket();
  const { user } = useAuth();

  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [game, setGame] = useState(new Chess());
  const [result, setResult] = useState<string | null>(null);
  const [drawOffers, setDrawOffers] = useState({ white: false, black: false });

  const color: "white" | "black" | null = gameState
    ? gameState.whiteId === user!.userId
      ? "white"
      : "black"
    : null;

  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    if (!connected) return;
    getActiveGame().then(({ status, data }) => {
      if (status !== 200 || !data) return;
      const state = data as GameStateType;
      const chess = new Chess();
      state.moves.forEach((m) => {
        try {
          chess.move(m);
        } catch {}
      });
      setGameState(state);
      setGame(chess);
      setResult(null);
      setDrawOffers({
        white: state.whiteDrawOffer,
        black: state.blackDrawOffer,
      });
    });
  }, [connected]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "MOVE") {
        const { move } = msg as WsMoveType;
        setDrawOffers({ white: false, black: false });
        setGame((prev) => {
          const next = new Chess(prev.fen());
          try {
            next.move(move);
          } catch {}
          return next;
        });
      }

      if (msg.type === "OFFER_DRAW") {
        const c = colorRef.current;
        if (!c) return;
        const opponent = c === "white" ? "black" : "white";
        setDrawOffers((prev) => ({ ...prev, [opponent]: true }));
      }

      if (msg.type === "GAME_ENDED") {
        const { status, endedBy } = msg as WsGameEndedType;
        const label: Record<string, string> = {
          WHITE_WIN: "White wins",
          BLACK_WIN: "Black wins",
        };
        setResult(
          status === "DRAW"
            ? `Draw by ${endedBy}`
            : `${label[status] ?? "Game over"} by ${endedBy}`,
        );
      }
    });
  }, [subscribe]);

  function onPieceDrop(from: string, to: string): boolean {
    if (!gameState || !color || !connected) return false;
    const turn = game.turn();
    if (
      (color === "white" && turn !== "w") ||
      (color === "black" && turn !== "b")
    )
      return false;
    const next = new Chess(game.fen());
    try {
      const move = next.move({ from, to, promotion: "q" });
      const sent = sendJson({
        type: "MOVE",
        gameId: gameState.gameId,
        move: move.from + move.to + (move.promotion ?? ""),
      });
      if (!sent) return false;
      setGame(next);
      return true;
    } catch {
      return false;
    }
  }

  function onDraw() {
    if (!gameState || !color || !connected) return;
    sendJson({ type: "OFFER_DRAW", gameId: gameState.gameId });
    setDrawOffers((prev) => ({ ...prev, [color]: true }));
  }

  function resign() {
    if (!gameState || !connected) return;
    sendJson({ type: "RESIGN", gameId: gameState.gameId });
  }

  if (!gameState || !color) return <p>Loading game…</p>;

  return (
    <GameCard
      game={game}
      result={result}
      color={color}
      whiteUsername={gameState.whiteUsername}
      blackUsername={gameState.blackUsername}
      onPieceDrop={onPieceDrop}
      onDraw={onDraw}
      whiteDrawOffer={drawOffers.white}
      blackDrawOffer={drawOffers.black}
      resign={resign}
    />
  );
}
