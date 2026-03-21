/**
 * Scrollable lobby chat with transparency and idle fade-away.
 */

import { useEffect, useRef, useState } from "react";

export function ChatLog({ messages, onSend }) {
  const [draft, setDraft] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const listRef = useRef(null);
  const idleTimerRef = useRef(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 5000);
  };

  useEffect(() => {
    resetIdleTimer();
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    return () => clearTimeout(idleTimerRef.current);
  }, [messages, draft]);

  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    onSend?.(t);
    setDraft("");
  };

  return (
    <div className="hud-chat">
      <ul ref={listRef} className={`hud-chat__log ${isIdle && !draft ? "hud-chat__log--idle" : ""}`}>
        {messages.map((m) => (
          <li key={m.id} className="hud-chat__line">
            <span className="hud-chat__who">{m.who}:</span> {m.text}
          </li>
        ))}
      </ul>
      <div className="hud-chat__row">
        <input
          className="hud-chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Message"
          aria-label="Chat message"
        />
        <button type="button" className="hud-chat__send" onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
}
