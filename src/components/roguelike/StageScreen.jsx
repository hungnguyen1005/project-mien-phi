import { getStageOpeningDialogue } from "../../game/roguelike/cutsceneSystem";
import {
  COMBAT_ACTIONS,
  MANA_BURST_COST,
  getCurrentMonster,
} from "../../game/roguelike/combatSystem";
import {
  getDifficultyLabel,
  getMonsterScalingPreview,
} from "../../game/roguelike/scalingSystem";
import PlayerHud from "./PlayerHud";
import StatBar from "./StatBar";

export default function StageScreen({ state, derived, onAttack, onActivateArtifact }) {
  const { player, currentStage, combat } = state;
  const monster = getCurrentMonster(combat);
  const openingLines = getStageOpeningDialogue(currentStage);
  const scaling = getMonsterScalingPreview(currentStage, player);

  return (
    <section className="game-layout">
      <PlayerHud
        player={player}
        stats={derived.playerStats}
        playerPowerLevel={derived.playerPowerLevel}
        specialArtifact={derived.specialArtifact}
        onActivateArtifact={onActivateArtifact}
      />

      <div className="combat-panel">
        <header className="combat-header">
          <div>
            <p className="eyebrow">
              Stage {currentStage.stageNumber} / 5 · {getDifficultyLabel(currentStage.difficulty)}
            </p>
            <h1>{currentStage.name}</h1>
            <p>{currentStage.subtitle}</p>
          </div>
          <div className="scaling-badge">
            <span>Power {scaling.playerPowerLevel}</span>
            <span>Quái Lv.{scaling.expectedMonsterLevel}</span>
          </div>
        </header>

        <div className={`battlefield ${currentStage.difficulty}`}>
          <div className="battle-road" />
          <div className="combatant player-piece">
            <span>{player.character.image}</span>
            <small>{player.character.name}</small>
          </div>
          {monster && (
            <div className="combatant monster-piece">
              <span>{monster.icon}</span>
              <small>{monster.name}</small>
            </div>
          )}
        </div>

        {monster && (
          <div className="monster-panel">
            <div>
              <p className="eyebrow">Monster Lv.{monster.level}</p>
              <h2>{monster.name}</h2>
            </div>
            <StatBar label="Monster HP" value={monster.currentHp} max={monster.maxHp} tone="danger" />
          </div>
        )}

        <div className="combat-actions">
          <button
            type="button"
            className="pixel-btn"
            onClick={() => onAttack(COMBAT_ACTIONS.BASIC)}
            disabled={!monster}
          >
            Đánh thường
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn-glow"
            onClick={() => onAttack(COMBAT_ACTIONS.MANA_BURST)}
            disabled={!monster || player.mana < MANA_BURST_COST}
          >
            Mana Burst
          </button>
        </div>

        {state.notice && <p className="notice-line">{state.notice}</p>}

        <div className="stage-dialogue">
          {openingLines.map((line) => (
            <p key={`${line.speaker}-${line.text}`}>
              <strong>{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>

        <div className="combat-log">
          {(combat.log ?? []).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
