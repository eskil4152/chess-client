export type WsIncomingChallenge = {
  type: "CHALLENGE";
  challengeId: string;
  challenger: string;
  timeControl: string;
};

export type WsChallengeCancelled = {
  type: "CHALLENGE_CANCELLED";
  challengeId: string;
  challenger: string;
};

export type WsChallengeDeclined = {
  type: "CHALLENGE_DECLINED";
  challengeId: string;
  receiver: string;
};

export type WsChallengeExpired = {
  type: "CHALLENGE_EXPIRED";
};

export type WsSendChallenge = {
  type: "CHALLENGE";
  receiver: string;
  timeControl: string;
};

export type WsSendChallengeResponse = {
  type: "CHALLENGE_RESPONSE";
  challengeId: string;
  accepted: boolean;
};

export type WsSendCancelChallenge = {
  type: "CANCEL_CHALLENGE";
  challengeId: string;
};
