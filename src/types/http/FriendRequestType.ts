export type FriendRequest = {
  requestId: string;
  username: string;
  avatarUrl: string;
};

export type FriendRequestsDTO = {
  friendRequests: FriendRequest[];
};
