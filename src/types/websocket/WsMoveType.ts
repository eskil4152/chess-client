export type WsMoveType = {
  type: "MOVE";
  gameId: string;
  move: string;
  increment: number;
  whiteMove: boolean;
};
