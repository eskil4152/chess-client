import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChallengeProvider } from "./ChallengeProvider";
import "../styles/Header.css";
import getFriendRequests from "../features/api/getFriendRequests";
import { FriendRequestsDTO } from "../types/http/FriendRequestType";
import Header from "../components/Header";

function StatusBar({ connected }: { connected: boolean }) {
  return (
    <div className={`status-bar ${connected ? "connected" : "disconnected"}`}>
      {connected ? "Connected" : "Disconnected"}
    </div>
  );
}

type WsMessage = {
  type: string;
  [key: string]: any;
};

type WebSocketContextType = {
  connected: boolean;
  sendJson: (payload: unknown) => boolean;
  subscribe: (listener: (event: WsMessage) => void) => () => void;
  pendingRequestCount: number;
  clearPendingRequests: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export default function WebSocketProvider() {
  const navigate = useNavigate();

  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(event: WsMessage) => void>());
  const reconnectRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const wsUrl = import.meta.env.VITE_WS_URL;

  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const subscribe = useCallback((listener: (event: WsMessage) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const clearPendingRequests = useCallback(() => setPendingRequestCount(0), []);

  useEffect(() => {
    getFriendRequests().then((res) => {
      const dto = res?.data as FriendRequestsDTO | undefined;
      setPendingRequestCount(dto?.friendRequests?.length ?? 0);
    }).catch(() => {});
  }, []);

  const sendJson = useCallback((payload: unknown): boolean => {
    const state = wsRef.current?.readyState;
    if (state === WebSocket.OPEN) {
      wsRef.current!.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!wsUrl) return;

    let active = true;

    function connect() {
      const ws = new WebSocket(`${wsUrl}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectRef.current = 0;
        setConnected(true);
        const ping = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify({ type: "PING" }));
        }, 20000);
        ws.addEventListener("close", () => clearInterval(ping));
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);
          if (data.type === "ERROR" && data.code === 401)
            navigateRef.current("/login");
          if (data.type === "GAME_STARTED") navigateRef.current("/game");
          if (data.type === "FRIEND_REQUEST")
            setPendingRequestCount((c) => c + 1);
          listenersRef.current.forEach((l) => l(data));
        } catch {}
      };

      ws.onclose = () => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          setConnected(false);
        }
        if (!active) return;
        const delay = Math.min(500 * 2 ** reconnectRef.current, 30000);
        reconnectRef.current++;
        setTimeout(connect, delay);
      };

      ws.onerror = () => {
        if (wsRef.current === ws) setConnected(false);
      };
    }

    connect();

    return () => {
      active = false;
      wsRef.current?.close();
    };
  }, [wsUrl]);

  return (
    <WebSocketContext.Provider value={{ connected, sendJson, subscribe, pendingRequestCount, clearPendingRequests }}>
      <StatusBar connected={connected} />
      <ChallengeProvider>
        <Header />
        <Outlet />
      </ChallengeProvider>
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  return ctx;
}
