import { getBossPhase } from "../../game/roguelike/bossSystem";
import {
  COMBAT_ACTIONS,
  MANA_BURST_COST,
} from "../../game/roguelike/combatSystem";
import { getBossIntroDialogue } from "../../game/roguelike/cutsceneSystem";
import PlayerHud from "./PlayerHud";
import StatBar from "./StatBar";

export default function BossStage({ state, derived, onAttack, onActivateArtifact }) {
  const { player, bossCombat } = state;
  const phase = getBossPhase(bossCombat);
  const intro = getBossIntroDialogue();

  return (
    <section className="game-layout boss-layout">
      <PlayerHud
        player={player}
        stats={derived.playerStats}
        playerPowerLevel={derived.playerPowerLevel}
        specialArtifact={derived.specialArtifact}
        onActivateArtifact={onActivateArtifact}
      />

      <div className="combat-panel boss-panel">
        <header className="combat-header">
          <div>
            <p className="eyebrow">Final Boss</p>
            <h1>{bossCombat.name}</h1>
            <p>{phase?.name}</p>
          </div>
          <div className="scaling-badge">
            <span>Power {bossCombat.playerPowerLevel}</span>
            <span>{derived.specialArtifact.isActivated ? "Artifact sáng" : "Artifact chưa sáng"}</span>
          </div>
        </header>

        <div className="battlefield hard boss-field">
          <div className="battle-road" />
          <div className="combatant player-piece">
            <span>{player.character.image}</span>
            <small>{player.character.name}</small>
          </div>
          <div className="combatant monster-piece boss-piece">
            <span>{bossCombat.icon}</span>
            <small>{bossCombat.name}</small>
          </div>
        </div>

        <div className="monster-panel">
          <div>
            <p className="eyebrow">Boss check ở 16% HP</p>
            <h2>{bossCombat.name}</h2>
          </div>
          <StatBar label="Boss HP" value={bossCombat.currentHp} max={bossCombat.maxHp} tone="danger" />
        </div>

        <div className="combat-actions">
          <button
            type="button"
            className="pixel-btn"
            onClick={() => onAttack(COMBAT_ACTIONS.BASIC)}
          >
            Đánh thường
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn-glow"
            onClick={() => onAttack(COMBAT_ACTIONS.MANA_BURST)}
            disabled={player.mana < MANA_BURST_COST}
          >
            Mana Burst
          </button>
        </div>

        {state.notice && <p className="notice-line">{state.notice}</p>}

        <div className="stage-dialogue">
          {intro.map((line) => (
            <p key={`${line.speaker}-${line.text}`}>
              <strong>{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>

        <div className="combat-log">
          {(bossCombat.log ?? []).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
