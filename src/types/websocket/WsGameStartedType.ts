export type WsGameStartedType = {
  type: "GAME_STARTED";
  gameId: string;
  whiteId: string;
  whiteUsername: string;
  blackId: string;
  blackUsername: string;
};