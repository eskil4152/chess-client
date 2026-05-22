import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { useAuth } from "../../providers/AuthProvider";
import { WsMoveType } from "../../types/websocket/WsMoveType";
import { WsGameEndedType } from "../../types/websocket/WsGameEndedType";
import { GameStateType } from "../../types/http/GameStateType";
import GameCard from "../../components/GameCard";
import getMyActiveGame from "../../features/api/getMyActiveGame";
import getActiveGame from "../../features/api/getActiveGame";
import {
  playMoveSound,
  playCaptureSound,
  playCheckSound,
  playCheckmateSound,
  playVictorySound,
  playDefeatSound,
  playDrawSound,
} from "../../utils/sounds";
import { useParams } from "react-router-dom";

export default function Game() {
  const { subscribe, sendJson, connected } = useWebSocket();
  const { user } = useAuth();

  const { gameId } = useParams<{ gameId: string }>();

  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [game, setGame] = useState(new Chess());
  const [result, setResult] = useState<string | null>(null);
  const [endElos, setEndElos] = useState<{
    white: number;
    black: number;
  } | null>(null);
  const [drawOffers, setDrawOffers] = useState({ white: false, black: false });
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
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
  useEffect(() => {
    turnRef.current = game.turn();
  }, [game]);

  const gameRef = useRef(game);
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (!connected) return;
    const fetch = gameId ? getActiveGame(gameId) : getMyActiveGame();
    fetch.then(({ status, data }) => {

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
        const { move, increment: inc, whiteMove } = msg as WsMoveType;
        const next = new Chess(gameRef.current.fen());

        try {
          const m = next.move(move);
          if (next.isCheckmate()) playCheckmateSound();
          else if (next.inCheck()) playCheckSound();
          else if (m.captured) playCaptureSound();
          else playMoveSound();
        } catch {}

        if (whiteMove) setBlackMs((ms) => (ms !== null ? ms + inc : null));
        else setWhiteMs((ms) => (ms !== null ? ms + inc : null));

        setDrawOffers({ white: false, black: false });
        setSelectedSquare(null);
        setLastMove({ from: move.slice(0, 2), to: move.slice(2, 4) });
        setGame(next);
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
            ? `Draw by ${endedBy.replace("_", " ")}`
            : `${label[status] ?? "Game over"} by ${endedBy}`,
        );
        setEndElos({ white: whiteElo, black: blackElo });
        const c = colorRef.current;
        if (status === "DRAW") playDrawSound();
        else if (
          (status === "WHITE_WIN" && c === "white") ||
          (status === "BLACK_WIN" && c === "black")
        )
          playVictorySound();
        else playDefeatSound();
      }
    });
  }, [subscribe]);

  const hasClock = whiteMs !== null && blackMs !== null;
  useEffect(() => {
    if (!hasClock || !!result) return;
    const id = setInterval(() => {
      if (turnRef.current === "w") {
        setWhiteMs((prev) => (prev !== null ? Math.max(0, prev - 1000) : null));
      } else {
        setBlackMs((prev) => (prev !== null ? Math.max(0, prev - 1000) : null));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [hasClock, result]);

  function onSquareClick(square: string) {
    if (!gameState || !color || !connected || result) return;
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }
      const moved = onPieceDrop(selectedSquare, square);
      setSelectedSquare(moved ? null : square);
    } else {
      const piece = game.get(square as any);
      if (
        piece &&
        ((color === "white" && piece.color === "w") ||
          (color === "black" && piece.color === "b"))
      ) {
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
      setLastMove({ from: move.from, to: move.to });
      if (next.isCheckmate()) playCheckmateSound();
      else if (next.inCheck()) playCheckSound();
      else if (move.captured) playCaptureSound();
      else playMoveSound();
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

  if (!connected)
    return (
      <div className="page">
        <p className="game-status-msg">Connecting…</p>
      </div>
    );
  if (!gameState)
    return (
      <div className="page">
        <p className="game-status-msg">
          {gameId ? "Game not found" : "You are not currently in a game"}
        </p>
      </div>
    );

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
