export default function AudioToggle({ enabled, onToggle, audioRef }) {
  const handleToggle = () => {
    const next = !enabled;
    onToggle(next);

    const audio = audioRef?.current;
    if (!audio) return;

    if (next) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <button
      type="button"
      className="audio-toggle pixel-btn"
      onClick={handleToggle}
      title={enabled ? "Tắt nhạc" : "Bật nhạc"}
      aria-label={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
