import { GameStatus } from "../http/GameStatus";

export type WsGameEndedType = {
  type: "GAME_ENDED";
  gameId: string;
  status: GameStatus;
};
