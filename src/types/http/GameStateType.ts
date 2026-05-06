export type GameStateType = {
  gameId: string;
  whiteId: string;
  whiteUsername: string;
  blackId: string;
  blackUsername: string;
  moves: string[];
  whiteDrawOffer: boolean;
  blackDrawOffer: boolean;
};
