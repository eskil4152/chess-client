import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import "../../styles/Friends.css";
import "../../styles/Auth.css";
import getFriends from "../../features/api/getFriends";
import getFriendRequests from "../../features/api/getFriendRequests";
import respondToFriendRequest from "../../features/api/respondToFriendRequest";
import { FriendType } from "../../types/http/FriendType";
import { FriendRequest, FriendRequestsDTO } from "../../types/http/FriendRequestType";
import FriendCard from "../../components/FriendCard";
import { useWebSocket } from "../../providers/WebSocketProvider";

export default function Friends() {
  const navigate = useNavigate();
  const { subscribe } = useWebSocket();
  const [searchInput, setSearchInput] = useState("");
  const [responding, setResponding] = useState<string | null>(null);

  const { loading, error, response, reload: reloadFriends } = useLoading(
    useCallback(() => getFriends(), []),
  );

  const {
    loading: requestsLoading,
    error: requestsError,
    response: requestsResponse,
    reload: reloadRequests,
  } = useLoading(useCallback(() => getFriendRequests(), []));

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "FRIEND_REQUEST") reloadRequests();
    });
  }, [subscribe, reloadRequests]);

  async function handleRespond(requestId: string, accepted: boolean) {
    setResponding(requestId);
    try {
      await respondToFriendRequest(requestId, accepted);
      await Promise.all([reloadRequests(), ...(accepted ? [reloadFriends()] : [])]);
    } finally {
      setResponding(null);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) navigate(`/user?username=${encodeURIComponent(trimmed)}`);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const friends = (response?.data as FriendType[]) ?? [];
  const requests = ((requestsResponse?.data as FriendRequestsDTO)?.friendRequests) ?? [];

  return (
    <div className="profile">
      <div className="friend-list">
        <form className="user-search" onSubmit={handleSearch}>
          <label className="label-upper user-search-label">Search for user</label>
          <div className="user-search-row">
            <input
              className="form-input"
              type="text"
              placeholder="Username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn" type="submit">
              Search
            </button>
          </div>
        </form>

        {!requestsLoading && !requestsError && requests.length > 0 && (
          <>
            <h2 className="section-h2">Friend Requests</h2>
            {requests.map((req: FriendRequest) => (
              <div key={req.requestId} className="card-sm friend-request-card">
                <div className="friend-card-avatar-wrapper">
                  <img
                    src={req.avatarUrl || "/default_profile.png"}
                    alt={req.username}
                    className="avatar friend-card-avatar"
                  />
                </div>
                <div className="friend-request-info">
                  <span className="friend-card-username">{req.username}</span>
                  <div className="friend-request-actions">
                    <button
                      className="btn btn-pill"
                      disabled={responding === req.requestId}
                      onClick={() => handleRespond(req.requestId, true)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-pill btn-danger"
                      disabled={responding === req.requestId}
                      onClick={() => handleRespond(req.requestId, false)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <h2 className="section-h2">Friends</h2>
        {friends.length > 0
          ? friends.map((friend: FriendType) => (
              <FriendCard
                key={friend.userId}
                userId={friend.userId}
                username={friend.username}
                bio={friend.bio}
                avatar={friend.avatarUrl}
                isOnline={friend.isOnline}
              />
            ))
          : "No friends yet."}
      </div>
    </div>
  );
}
