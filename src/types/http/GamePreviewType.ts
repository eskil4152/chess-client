export type GamePreviewType = {
  gameId: string;
  whiteUsername: string;
  blackUsername: string;
  status: GameStatus;
};

enum GameStatus {
  ONGOING,
  WHITE_WIN,
  BLACK_WIN,
  DRAW,
}
