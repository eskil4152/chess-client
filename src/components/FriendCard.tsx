import "../styles/Friends.css";

type FriendCardProps = {
  username: string;
  bio: string;
  avatar: string;
};

export default function FriendCard({ username, bio, avatar }: FriendCardProps) {
  return (
    <div className="friend-card">
      {avatar
        ? <img src={avatar} alt={username} className="friend-card-avatar" />
        : <div className="friend-card-avatar-placeholder" />
      }
      <div className="friend-card-info">
        <span className="friend-card-username">{username}</span>
        {bio && <span className="friend-card-bio">{bio}</span>}
      </div>
    </div>
  );
}