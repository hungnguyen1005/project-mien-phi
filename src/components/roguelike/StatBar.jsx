export default function StatBar({ label, value, max, tone = "rose" }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;

  return (
    <div className="stat-bar">
      <div className="stat-bar-label">
        <span>{label}</span>
        <span>
          {Math.round(value)} / {Math.round(max)}
        </span>
      </div>
      <div className="stat-bar-track">
        <span className={`stat-bar-fill ${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
