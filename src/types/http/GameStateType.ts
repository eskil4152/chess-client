export type GameStateType = {
  gameId: string;
  whiteId: string;
  whiteUsername: string;
  blackId: string;
  blackUsername: string;
  whiteElo: number;
  blackElo: number;
  moves: string[];
  whiteDrawOffer: boolean;
  blackDrawOffer: boolean;
  whiteRemainingMs?: number | null;
  blackRemainingMs?: number | null;
};
