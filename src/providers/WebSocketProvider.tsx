import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";

type WsMessage = {
  type: string;
  [key: string]: any;
};

type WebSocketContextType = {
  connected: boolean;
  sendJson: (payload: unknown) => void;
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

  const subscribe = useCallback((listener: (event: WsMessage) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const sendJson = useCallback((payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
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
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);

          if (data.type === "ERROR") {
            if (data.code === 401) navigate("/login");
          }

          listenersRef.current.forEach((l) => l(data));
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;

        if (!active) return;

        const delay = Math.min(2000 * 2 ** reconnectRef.current, 30000);
        reconnectRef.current++;

        setTimeout(connect, delay);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    }

    connect();

    return () => {
      active = false;
      wsRef.current?.close();
    };
  }, [wsUrl, navigate]);

  return (
    <WebSocketContext.Provider value={{ connected, sendJson, subscribe }}>
      <Outlet />
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }
  return ctx;
}
