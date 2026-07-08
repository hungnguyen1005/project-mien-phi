import { SPECIAL_ARTIFACT_ID, itemTypes } from "../../data/items";
import { getExpToNextLevel } from "../../game/roguelike/levelSystem";
import StatBar from "./StatBar";

const EmptySlot = ({ label }) => <li className="empty-slot">{label}: trống</li>;

export default function PlayerHud({
  player,
  stats,
  playerPowerLevel,
  specialArtifact,
  onActivateArtifact,
}) {
  const expToNextLevel = getExpToNextLevel(player.level);
  const weapon = player.items.find((item) => item.type === itemTypes.WEAPON);
  const armor = player.items.find((item) => item.type === itemTypes.ARMOR);
  const artifacts = player.items.filter((item) => item.type === itemTypes.ARTIFACT);

  return (
    <aside className="player-hud">
      <div className="hud-hero">
        <div className="hud-avatar" style={{ borderColor: player.character.color }}>
          {player.character.image}
        </div>
        <div>
          <p className="hud-kicker">Class</p>
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
        <ul className="chip-list slot-list">
          {weapon ? (
            <li className={`rarity-${weapon.rarity}`}>Vũ khí: {weapon.name}</li>
          ) : (
            <EmptySlot label="Vũ khí" />
          )}
          {armor ? (
            <li className={`rarity-${armor.rarity}`}>Giáp: {armor.name}</li>
          ) : (
            <EmptySlot label="Giáp" />
          )}
        </ul>
      </div>

      <div className="hud-section">
        <h3>Artifact {artifacts.length}/3</h3>
        {artifacts.length === 0 ? (
          <p className="muted">Chưa có artifact.</p>
        ) : (
          <ul className="chip-list">
            {artifacts.map((artifact) => (
              <li key={artifact.id} className={`rarity-${artifact.rarity}`}>
                {artifact.name}
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
              <li key={augment.id} className={`rarity-${augment.rarity}`}>
                {augment.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hud-section artifact-status">
        <h3>Tinh Hạch Vĩnh Cửu</h3>
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
