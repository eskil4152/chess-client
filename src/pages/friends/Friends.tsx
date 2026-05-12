import { useCallback } from "react";
import useLoading from "../../utils/useLoading";
import "../../styles/Friends.css";
import getFriends from "../../features/api/getFriends";
import { FriendType } from "../../types/http/FriendType";
import FriendCard from "../../components/FriendCard";

export default function Friends() {
  const { loading, error, response } = useLoading(
    useCallback(() => getFriends(), []),
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const friends = response?.data as FriendType[] ?? [];

  return (
    <div className="profile">
      <div className="friend-list">
        <h2>Friends</h2>
        {friends.length > 0
          ? friends.map((friend: FriendType) => (
              <FriendCard
                key={friend.userId}
                username={friend.username}
                bio={friend.bio}
                avatar={friend.avatarUrl}
              />
            ))
          : "No friends yet."}
      </div>
    </div>
  );
}
