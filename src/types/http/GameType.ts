export type GameType = {
  gameId: string;
  whiteUsername: string;
  blackUsername: string;
  status: GameStatus;
  moves: Array<String>;
};

enum GameStatus {
  ONGOING,
  WHITE_WIN,
  BLACK_WIN,
  DRAW,
}
