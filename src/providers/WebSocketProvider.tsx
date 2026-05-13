import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Header.css";

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
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export default function WebSocketProvider() {
  const navigate = useNavigate();

  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(event: WsMessage) => void>());
  const reconnectRef = useRef(0);

  const [connected, setConnected] = useState(false);

  const wsUrl = process.env.REACT_APP_WS_API_URL;

  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  const subscribe = useCallback((listener: (event: WsMessage) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
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
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "PING" }));
        }, 20000);
        ws.addEventListener("close", () => clearInterval(ping));
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);
          if (data.type === "ERROR" && data.code === 401) navigateRef.current("/login");
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
    <WebSocketContext.Provider value={{ connected, sendJson, subscribe }}>
      <StatusBar connected={connected} />
      <Outlet />
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used inside WebSocketProvider");
  return ctx;
}
