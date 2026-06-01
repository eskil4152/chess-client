import { useCallback, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useLoading from "../../utils/useLoading";
import getUser from "../../features/api/getUser";
import addFriend from "../../features/api/addFriend";
import removeFriend from "../../features/api/removeFriend";
import editProfile from "../../features/api/editProfile";
import editPassword from "../../features/api/editPassword";
import { UserDataType } from "../../types/http/ProfileType";
import logout from "../../features/api/logout";
import { useAuth } from "../../providers/AuthProvider";
import "../../styles/User.css";
import "../../styles/Auth.css";

export default function User() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [editOpen, setEditOpen] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bioError, setBioError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [bioSuccess, setBioSuccess] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const { loading, error, response } = useLoading(
    useCallback(() => getUser(username!), [username]),
  );
  const [localUser, setLocalUser] = useState<UserDataType | null>(null);

  async function handleLogout() {
    await logout();
    sessionStorage.removeItem("auth");
    setUser(null);
    navigate("/login");
  }

  if (!username) return <div>No username provided</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const responseUser = localUser ?? (response?.data as UserDataType);

  const isUser = username === user?.username;
  const isFriend = responseUser.isFriend;

  async function handleFriend() {
    if (isFriend) {
      await removeFriend(username!);
    } else {
      await addFriend(username!);
    }
  }

  function openEdit() {
    if (editOpen) {
      setEditOpen(false);
      return;
    }
    setBioInput(responseUser.bio ?? "");
    setAvatarInput(responseUser.avatarUrl ?? "");
    setEditOpen(true);
  }

  async function handleSaveBio() {
    setBioError(null);
    setBioSuccess(null);
    try {
      const res = await editProfile("bio", bioInput);
      if (res.status >= 400) {
        setBioError("Failed to update bio.");
        return;
      }
      setLocalUser({ ...responseUser, bio: bioInput || undefined });
      setBioSuccess("Bio updated.");
      setEditOpen(false);
    } catch {
      setBioError("Something went wrong.");
    }
  }

  async function handleSaveAvatar() {
    setAvatarError(null);
    setAvatarSuccess(null);
    try {
      const res = await editProfile("avatarUrl", avatarInput);
      if (res.status >= 400) {
        setAvatarError("Failed to update avatar.");
        return;
      }
      setLocalUser({ ...responseUser, avatarUrl: avatarInput || null });
      setAvatarSuccess("Avatar updated.");
      setEditOpen(false);
    } catch {
      setAvatarError("Something went wrong.");
    }
  }

  async function handleSavePassword() {
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!oldPassword || !newPassword) {
      setPasswordError("Both password fields are required.");
      return;
    }
    try {
      const res = await editPassword(oldPassword, newPassword);
      if (res.status >= 400) {
        setPasswordError(
          "Failed to update password. Check your current password.",
        );
        return;
      }
      setOldPassword("");
      setNewPassword("");
      setPasswordSuccess("Password updated.");
      setEditOpen(false);
    } catch {
      setPasswordError("Something went wrong.");
    }
  }

  return (
    <div className="profile">
      <div className="card profile-card">
        <img
          className="avatar profile-avatar"
          src={responseUser.avatarUrl || "/default_profile.png"}
          alt="avatar"
        />
        <p className="profile-username">{responseUser.username}</p>

        <div className="profile-elo-grid">
          <span />
          <span>Bullet</span>
          <span>Blitz</span>
          <span>Rapid</span>
          <span>Classical</span>

          <span>Elo</span>
          <span>{responseUser.bulletElo}</span>
          <span>{responseUser.blitzElo}</span>
          <span>{responseUser.rapidElo}</span>
          <span>{responseUser.classicalElo}</span>

          <span>Games</span>
          <span>{responseUser.bulletGames}</span>
          <span>{responseUser.blitzGames}</span>
          <span>{responseUser.rapidGames}</span>
          <span>{responseUser.classicalGames}</span>

          <span>Wins</span>
          <span>{responseUser.bulletWins}</span>
          <span>{responseUser.blitzWins}</span>
          <span>{responseUser.rapidWins}</span>
          <span>{responseUser.classicalWins}</span>

          <span>Win %</span>
          <span>{responseUser.bulletWinPercentage}%</span>
          <span>{responseUser.blitzWinPercentage}%</span>
          <span>{responseUser.rapidWinPercentage}%</span>
          <span>{responseUser.classicalWinPercentage}%</span>
        </div>

        {!isUser && (
          <div className="card-sm profile-active-game">
            {responseUser.activeGameId != null ? (
              <>
                <span className="profile-active-dot" />
                <span className="label-upper profile-active-label">Live game</span>
                <Link
                  to={"/game/" + responseUser.activeGameId}
                  className="btn btn-pill profile-spectate-btn"
                >
                  Spectate
                </Link>
              </>
            ) : (
              <span className="label-upper">Not in a game</span>
            )}
          </div>
        )}

        {responseUser.bio && <p className="profile-bio">{responseUser.bio}</p>}
        <div className="profile-actions">
          <Link
            to={`/games/user?username=${responseUser.username}`}
            className="btn btn-pill"
          >
            Game history
          </Link>
          {isUser && (
            <button className="btn btn-pill" onClick={openEdit}>
              Edit
            </button>
          )}
        </div>
      </div>

      {isUser && editOpen && (
        <div className="card profile-edit-card">
          <p className="label-upper profile-edit-section-title">Bio</p>
          <input
            className="form-input"
            type="text"
            placeholder="Bio"
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
          <button className="btn" onClick={handleSaveBio}>
            Save bio
          </button>
          {bioError && <p className="msg-error">{bioError}</p>}
          {bioSuccess && <p className="msg-success">{bioSuccess}</p>}

          <p className="label-upper profile-edit-section-title">Avatar URL</p>
          <input
            className="form-input"
            type="text"
            placeholder="Avatar URL"
            value={avatarInput}
            onChange={(e) => setAvatarInput(e.target.value)}
          />
          <button className="btn" onClick={handleSaveAvatar}>
            Save avatar
          </button>
          {avatarError && <p className="msg-error">{avatarError}</p>}
          {avatarSuccess && (
            <p className="msg-success">{avatarSuccess}</p>
          )}

          <p className="label-upper profile-edit-section-title">Change password</p>
          <input
            className="form-input"
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn" onClick={handleSavePassword}>
            Save password
          </button>
          {passwordError && (
            <p className="msg-error">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="msg-success">{passwordSuccess}</p>
          )}
        </div>
      )}

      {!isUser && (
        <button className="btn btn-pill" onClick={handleFriend}>
          {isFriend ? "Remove friend" : "Add friend"}
        </button>
      )}

      {isUser && (
        <button className="btn btn-danger" onClick={handleLogout}>
          Log out
        </button>
      )}
    </div>
  );
}
