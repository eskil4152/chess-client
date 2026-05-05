export type WsDrawOfferedType = {
  type: "OFFER_DRAW";
  gameId: string;
  byColor: "white" | "black";
};