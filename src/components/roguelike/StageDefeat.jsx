export default function StageDefeat({ onRetry, onRestart }) {
  return (
    <section className="flow-screen defeat-screen">
      <div className="pixel-panel defeat-panel">
        <p className="eyebrow">Game over</p>
        <h1>Stage này hơi quá tay rồi</h1>
        <p>Hết 3 mạng, nhưng đồ và level vẫn còn để anh thử lại map hiện tại.</p>
        <div className="split-actions">
          <button type="button" className="pixel-btn pixel-btn-glow" onClick={onRetry}>
            Thử lại stage
          </button>
          <button type="button" className="pixel-btn" onClick={onRestart}>
            Chơi lại từ đầu
          </button>
        </div>
      </div>
    </section>
  );
}
