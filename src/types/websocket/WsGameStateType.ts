export type WsGameStateType = {
  type: "GAME_STATE";
  gameId: string;
  whiteId: string;
  whiteUsername: string;
  blackId: string;
  blackUsername: string;
  moves: string[];
};