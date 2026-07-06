import { SPECIAL_ARTIFACT_ID } from "../../data/items";
import { getExpToNextLevel } from "../../game/roguelike/levelSystem";
import StatBar from "./StatBar";

export default function PlayerHud({
  player,
  stats,
  playerPowerLevel,
  specialArtifact,
  onActivateArtifact,
}) {
  const expToNextLevel = getExpToNextLevel(player.level);

  return (
    <aside className="player-hud">
      <div className="hud-hero">
        <div className="hud-avatar" style={{ borderColor: player.character.color }}>
          {player.character.image}
        </div>
        <div>
          <p className="hud-kicker">Nguyễn Huy Hoàng</p>
          <h2>{player.character.name}</h2>
          <p>{player.character.passive.name}</p>
        </div>
      </div>

      <div className="hud-grid">
        <span>Level {player.level}</span>
        <span>{player.lives} mạng</span>
        <span>Power {playerPowerLevel}</span>
      </div>

      <StatBar label="HP" value={player.hp} max={stats.maxHp} tone="hp" />
      <StatBar label="Mana" value={player.mana} max={stats.maxMana} tone="mana" />
      <StatBar label="EXP" value={player.exp} max={expToNextLevel} tone="exp" />

      <div className="hud-section">
        <h3>Trang bị</h3>
        {player.items.length === 0 ? (
          <p className="muted">Chưa có món nào.</p>
        ) : (
          <ul className="chip-list">
            {player.items.map((item) => (
              <li key={item.id} className={item.isActivated ? "active" : ""}>
                {item.name} Lv.{item.level}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hud-section">
        <h3>Augment</h3>
        {player.augments.length === 0 ? (
          <p className="muted">Clear stage để nhận augment.</p>
        ) : (
          <ul className="chip-list">
            {player.augments.map((augment) => (
              <li key={augment.id}>
                {augment.name}
                {augment.stacks > 1 ? ` x${augment.stacks}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hud-section artifact-status">
        <h3>Artifact đặc biệt</h3>
        {!specialArtifact.isOwned && <p className="muted">Chưa sở hữu.</p>}
        {specialArtifact.isOwned && (
          <>
            <p>{specialArtifact.artifact.name}</p>
            <button
              type="button"
              className="pixel-btn compact"
              onClick={() => onActivateArtifact(SPECIAL_ARTIFACT_ID)}
              disabled={specialArtifact.isActivated}
            >
              {specialArtifact.isActivated ? "Đã kích hoạt" : "Kích hoạt"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
