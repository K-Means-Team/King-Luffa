/**
 * Map overlay markers: local player circle vs other players red diamond (HTML Marker children).
 */

export function LocalPlayerMarker() {
  return (
    <div
      className="player-marker player-marker--local"
      aria-hidden
    />
  );
}

export function OtherPlayerMarker() {
  return (
    <div
      className="player-marker player-marker--other"
      aria-hidden
    />
  );
}
