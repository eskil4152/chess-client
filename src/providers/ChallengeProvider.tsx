import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { useAuth } from "./AuthProvider";
import {
  WsIncomingChallenge,
  WsChallengeCancelled,
  WsSendChallenge,
  WsSendChallengeResponse,
  WsSendCancelChallenge,
} from "../types/websocket/WsChallengeType";
import ChallengeOverlay from "../components/ChallengeOverlay";

export type IncomingChallenge = {
  challengeId: string;
  challenger: string;
  timeControl: string;
};

export type OutgoingChallenge = {
  challengeId: string | null;
  receiverUsername: string;
  timeControl: string;
};

type ChallengeContextType = {
  incoming: IncomingChallenge | null;
  outgoing: OutgoingChallenge | null;
  sendChallenge: (receiverId: string, receiverUsername: string, timeControl: string) => void;
  cancelChallenge: () => void;
  respondToChallenge: (accepted: boolean) => void;
};

const ChallengeContext = createContext<ChallengeContextType | null>(null);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const { subscribe, sendJson } = useWebSocket();
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<IncomingChallenge | null>(null);
  const [outgoing, setOutgoing] = useState<OutgoingChallenge | null>(null);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "CHALLENGE") {
        const data = msg as WsIncomingChallenge;
        if (data.challenger === user?.username) {
          setOutgoing((prev) =>
            prev ? { ...prev, challengeId: data.challengeId } : null
          );
        } else {
          setIncoming({ challengeId: data.challengeId, challenger: data.challenger, timeControl: data.timeControl });
        }
      }
      if (msg.type === "CHALLENGE_CANCELLED") {
        const data = msg as WsChallengeCancelled;
        setIncoming((prev) => (prev?.challengeId === data.challengeId ? null : prev));
      }
      if (msg.type === "CHALLENGE_DECLINED" || msg.type === "CHALLENGE_EXPIRED") {
        setOutgoing(null);
      }
      if (msg.type === "GAME_STARTED") {
        setIncoming(null);
        setOutgoing(null);
      }
    });
  }, [subscribe, user?.username]);

  const sendChallenge = useCallback((receiverId: string, receiverUsername: string, timeControl: string) => {
    sendJson({ type: "CHALLENGE", receiver: receiverId, timeControl } satisfies WsSendChallenge);
    setOutgoing({ challengeId: null, receiverUsername, timeControl });
  }, [sendJson]);

  const cancelChallenge = useCallback(() => {
    if (outgoing?.challengeId) {
      sendJson({ type: "CANCEL_CHALLENGE", challengeId: outgoing.challengeId } satisfies WsSendCancelChallenge);
    }
    setOutgoing(null);
  }, [sendJson, outgoing]);

  const respondToChallenge = useCallback((accepted: boolean) => {
    if (!incoming) return;
    sendJson({ type: "CHALLENGE_RESPONSE", challengeId: incoming.challengeId, accepted } satisfies WsSendChallengeResponse);
    setIncoming(null);
  }, [sendJson, incoming]);

  return (
    <ChallengeContext.Provider value={{ incoming, outgoing, sendChallenge, cancelChallenge, respondToChallenge }}>
      {children}
      <ChallengeOverlay />
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error("useChallenge must be used within ChallengeProvider");
  return ctx;
}
