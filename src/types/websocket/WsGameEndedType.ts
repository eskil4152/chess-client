export type GameStatus = "ONGOING" | "WHITE_WIN" | "BLACK_WIN" | "DRAW";

export type WsGameEndedType = {
  type: "GAME_ENDED";
  gameId: string;
  status: GameStatus;
};