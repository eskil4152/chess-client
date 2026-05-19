import { GameStatus } from "./GameStatus";

export type GameType = {
  gameId: string;
  whiteUsername: string;
  blackUsername: string;
  status: GameStatus;
  moves: string;
};