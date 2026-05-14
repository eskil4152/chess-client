import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import "../../styles/Friends.css";
import "../../styles/Auth.css";
import getFriends from "../../features/api/getFriends";
import { FriendType } from "../../types/http/FriendType";
import FriendCard from "../../components/FriendCard";

export default function Friends() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { loading, error, response } = useLoading(
    useCallback(() => getFriends(), []),
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) navigate(`/user?username=${encodeURIComponent(trimmed)}`);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const friends = response?.data as FriendType[] ?? [];

  return (
    <div className="profile">
      <div className="friend-list">
        <form className="user-search" onSubmit={handleSearch}>
          <label className="user-search-label">Search for user</label>
          <div className="user-search-row">
            <input
              className="form-input"
              type="text"
              placeholder="Username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn" type="submit">Search</button>
          </div>
        </form>

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
