/**
 * Scrollable lobby chat with transparent panel and text-style send control.
 */

import { useRef, useState } from "react";

export function ChatLog({ messages, onSend }) {
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    onSend?.(t);
    setDraft("");
  };

  return (
    <div className="hud-chat">
      <ul ref={listRef} className="hud-chat__log">
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
