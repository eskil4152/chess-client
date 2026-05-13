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
  const [endElos, setEndElos] = useState<{ white: number; black: number } | null>(null);
  const [drawOffers, setDrawOffers] = useState({ white: false, black: false });
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [whiteMs, setWhiteMs] = useState<number | null>(null);
  const [blackMs, setBlackMs] = useState<number | null>(null);

  const color: "white" | "black" | null = gameState
    ? gameState.whiteId === user!.userId
      ? "white"
      : "black"
    : null;

  const colorRef = useRef(color);
  colorRef.current = color;

  const turnRef = useRef(game.turn());
  useEffect(() => { turnRef.current = game.turn(); }, [game]);


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
      setWhiteMs(state.whiteRemainingMs ?? null);
      setBlackMs(state.blackRemainingMs ?? null);
    });
  }, [connected]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "MOVE") {
        const { move } = msg as WsMoveType;
        setDrawOffers({ white: false, black: false });
        setSelectedSquare(null);
        setLastMove({ from: move.slice(0, 2), to: move.slice(2, 4) });
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
        const { status, endedBy, whiteElo, blackElo } = msg as WsGameEndedType;
        const label: Record<string, string> = {
          WHITE_WIN: "White wins",
          BLACK_WIN: "Black wins",
        };
        setResult(
          status === "DRAW"
            ? `Draw by ${endedBy.replaceAll('_', ' ')}`
            : `${label[status] ?? "Game over"} by ${endedBy}`,
        );
        setEndElos({ white: whiteElo, black: blackElo });
      }
    });
  }, [subscribe]);

  const hasClock = whiteMs !== null && blackMs !== null;
  useEffect(() => {
    if (!hasClock || !!result) return;
    const id = setInterval(() => {
      if (turnRef.current === "w") {
        setWhiteMs((prev) => prev !== null ? Math.max(0, prev - 1000) : null);
      } else {
        setBlackMs((prev) => prev !== null ? Math.max(0, prev - 1000) : null);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [hasClock, result]);

  function onSquareClick(square: string) {
    if (!gameState || !color || !connected || result) return;
    if (selectedSquare) {
      if (selectedSquare === square) { setSelectedSquare(null); return; }
      const moved = onPieceDrop(selectedSquare, square);
      setSelectedSquare(moved ? null : square);
    } else {
      const piece = game.get(square as any);
      if (piece && ((color === "white" && piece.color === "w") || (color === "black" && piece.color === "b"))) {
        setSelectedSquare(square);
      }
    }
  }

  function onPieceDrop(from: string, to: string): boolean {
    if (!gameState || !color || !connected) return false;

    const turn = game.turn();
    if (
      (color === "white" && turn !== "w") ||
      (color === "black" && turn !== "b")
    ) return false;
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
      setLastMove({ from: move.from, to: move.to });
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
      whiteElo={gameState.whiteElo}
      blackElo={gameState.blackElo}
      whiteEloChange={endElos ? endElos.white - gameState.whiteElo : null}
      blackEloChange={endElos ? endElos.black - gameState.blackElo : null}
      whiteMs={whiteMs}
      blackMs={blackMs}
      onPieceDrop={onPieceDrop}
      onSquareClick={onSquareClick}
      selectedSquare={selectedSquare}
      lastMove={lastMove}
      onDraw={onDraw}
      whiteDrawOffer={drawOffers.white}
      blackDrawOffer={drawOffers.black}
      resign={resign}
    />
  );
}
