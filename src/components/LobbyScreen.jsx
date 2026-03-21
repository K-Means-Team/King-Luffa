import { useAuth } from "../context/AuthContext";

export function LobbyScreen({ onMatchFound }) {
  const { session, logout } = useAuth();
  const userName = session?.user?.name || session?.userToken || "Player";

  const handleFindMatch = () => {
    onMatchFound();
  };

  return (
    <div className="lobby-screen screen-glass">
      <div className="lobby-screen__header">
        <div className="lobby-profile">
          <div className="lobby-profile__avatar"></div>
          <div className="lobby-profile__info">
            <span className="lobby-profile__name">{userName}</span>
            <span className="lobby-profile__status">Online</span>
          </div>
        </div>
        <button className="btn-secondary" onClick={logout}>Logout</button>
      </div>

      <div className="lobby-screen__content">
        <h2 className="lobby-screen__title">Ready to conquer?</h2>
        <div className="lobby-stats">
          <div className="lobby-stat">
            <span className="lobby-stat__val">1,204</span>
            <span className="lobby-stat__lbl">Score</span>
          </div>
          <div className="lobby-stat">
            <span className="lobby-stat__val">42</span>
            <span className="lobby-stat__lbl">Wins</span>
          </div>
        </div>
        
        <button className="btn-premium btn-pulse" onClick={handleFindMatch}>
          Start Matchmaking
        </button>
      </div>
    </div>
  );
}
