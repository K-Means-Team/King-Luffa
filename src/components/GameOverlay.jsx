/**
 * Full-viewport HUD: timer, buffs, chat, profile, points; composes King Luffa layout zones.
 */

import { AccountSidebar } from "./AccountSidebar";
import { BuffsDebuffs } from "./BuffsDebuffs";
import { ChatLog } from "./ChatLog";
import { CountdownTimer } from "./CountdownTimer";
import { Points } from "./Points";
import { ProfileButton } from "./ProfileButton";

export function GameOverlay({
  buffs,
  messages,
  onChatSend,
  points,
  sidebarOpen,
  setSidebarOpen,
  session,
  onLogout,
}) {
  return (
    <div className="game-overlay">
      <div className="game-overlay__top">
        <div className="game-overlay__top-mid">
          <CountdownTimer />
        </div>
        <div className="game-overlay__top-right">
          <BuffsDebuffs items={buffs} />
        </div>
      </div>
      <div className="game-overlay__mid-left">
        <ChatLog messages={messages} onSend={onChatSend} />
      </div>
      <div className="game-overlay__bottom">
        <ProfileButton onClick={() => setSidebarOpen(true)} />
        <Points value={points} />
      </div>
      <AccountSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        session={session}
        onLogout={onLogout}
      />
    </div>
  );
}
