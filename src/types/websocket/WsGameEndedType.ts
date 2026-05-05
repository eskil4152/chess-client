import { GameStatus } from "../http/GameStatus";

export type EndedBy = "checkmate" | "agreement" | "resignation" | "stalemate";

export type WsGameEndedType = {
  type: "GAME_ENDED";
  gameId: string;
  status: GameStatus;
  endedBy: EndedBy;
};
