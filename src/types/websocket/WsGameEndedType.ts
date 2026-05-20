import { GameStatus } from "../http/GameStatus";

export type EndedBy =
  | "checkmate"
  | "agreement"
  | "resignation"
  | "stalemate"
  | "repetition"
  | "insufficient_material"
  | "fifty_move_rule"
  | "timeout";

export type WsGameEndedType = {
  type: "GAME_ENDED";
  gameId: string;
  status: GameStatus;
  endedBy: EndedBy;
  whiteElo: number;
  blackElo: number;
};
