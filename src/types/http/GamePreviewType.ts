import { GameStatus } from "./GameStatus";

export type GamePreviewType = {
  gameId: string;
  whiteUsername: string;
  blackUsername: string;
  status: GameStatus;
  timeControl: string;
};
