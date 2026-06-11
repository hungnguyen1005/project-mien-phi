export default function AudioToggle({
  enabled,
  onToggle,
  audioRef,
  trackTitle,
  volume,
  onVolumeChange,
}) {
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

  const handleVolumeChange = (event) => {
    onVolumeChange(Number(event.target.value));
  };

  return (
    <section className="audio-panel" aria-label="Điều khiển nhạc nền">
      <div className="audio-track">
        <span className="audio-label">Đang phát</span>
        <strong title={trackTitle}>{trackTitle}</strong>
      </div>

      <div className="audio-controls">
        <button
          type="button"
          className="audio-toggle pixel-btn"
          onClick={handleToggle}
          title={enabled ? "Tắt nhạc" : "Bật nhạc"}
          aria-label={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
        >
          {enabled ? "Sound on" : "Muted"}
        </button>

        <label className="volume-control">
          <span>Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Âm lượng nhạc nền"
          />
        </label>
      </div>
    </section>
  );
}
