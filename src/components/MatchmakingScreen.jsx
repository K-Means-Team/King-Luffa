import { useEffect, useState } from "react";

export function MatchmakingScreen({ onReady }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const timer = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 600);
    const mockMatchDelay = setTimeout(() => {
      onReady();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(mockMatchDelay);
    };
  }, [onReady]);

  return (
    <div className="matchmaking-screen screen-glass">
      <div className="matchmaking-screen__radar">
        <div className="radar-ping"></div>
        <div className="radar-core"></div>
      </div>
      <h2 className="matchmaking-screen__text">Searching for opponents{dots}</h2>
      <p className="matchmaking-screen__sub">Expanding search radius...</p>
    </div>
  );
}
