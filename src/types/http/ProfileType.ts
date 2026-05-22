export type UserDataType = {
  username: string;
  bio?: string;
  avatarUrl: string | null;
  isFriend: boolean;
  blitzElo: number;
  blitzGames: number;
  bulletElo: number;
  bulletGames: number;
  rapidElo: number;
  rapidGames: number;
  classicalElo: number;
  classicalGames: number;
  activeGameId: string | null;
};
