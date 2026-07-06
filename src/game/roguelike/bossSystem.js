import { finalBossTemplate } from "../../data/monsters";
import { ENDINGS } from "./gameState";
import { getSpecialArtifactStatus } from "./itemSystem";
import {
  calculatePlayerPowerLevel,
  damagePlayer,
  getPlayerStats,
  restoreMana,
  spendMana,
} from "./playerState";
import { COMBAT_ACTIONS, MANA_BURST_COST } from "./combatSystem";

const calculateBossDamage = (boss, stats) => {
  const phase = getBossPhase(boss);
  const phaseMultiplier = phase?.damageMultiplier ?? 1;
  const rawDamage = Math.max(1, boss.damage * phaseMultiplier - stats.defense);

  return Math.max(1, Math.round(rawDamage * (1 - stats.damageReduction)));
};

const calculatePlayerDamage = (stats, action) => {
  const actionMultiplier = action === COMBAT_ACTIONS.MANA_BURST ? 1.7 : 1;
  const variance = 0.9 + Math.random() * 0.18;
  const isCrit = Math.random() < stats.critChance;
  const damage =
    stats.attack *
    (1 + stats.damageBonusPercent) *
    (1 + stats.attackSpeedBonus * 0.35) *
    actionMultiplier *
    variance *
    (isCrit ? stats.critDamage : 1);

  return {
    damage: Math.max(1, Math.round(damage)),
    isCrit,
  };
};

export const createBossCombat = (player) => {
  const playerPowerLevel = calculatePlayerPowerLevel(player);
  const maxHp = Math.round(finalBossTemplate.baseHp * (1 + playerPowerLevel * 0.09));
  const damage = Math.round(finalBossTemplate.baseDamage * (1 + playerPowerLevel * 0.035));

  return {
    ...finalBossTemplate,
    maxHp,
    currentHp: maxHp,
    damage,
    playerPowerLevel,
    log: ["Final boss xuất hiện."],
  };
};

export const getBossPhase = (boss) => {
  const hpPercent = boss.currentHp / boss.maxHp;
  return [...boss.phases]
    .sort((a, b) => a.threshold - b.threshold)
    .find((phase) => hpPercent <= phase.threshold);
};

export const performBossTurn = (player, boss, action = COMBAT_ACTIONS.BASIC) => {
  let nextPlayer = player;
  const stats = getPlayerStats(nextPlayer);
  const turnLog = [];

  if (action === COMBAT_ACTIONS.MANA_BURST) {
    if (nextPlayer.mana < MANA_BURST_COST) {
      return {
        player: nextPlayer,
        boss,
        endingType: null,
        log: [`Không đủ mana để dùng Mana Burst. Cần ${MANA_BURST_COST} mana.`],
      };
    }

    nextPlayer = spendMana(nextPlayer, MANA_BURST_COST);
  }

  const attack = calculatePlayerDamage(stats, action);
  const nextBoss = {
    ...boss,
    currentHp: Math.max(0, boss.currentHp - attack.damage),
  };

  turnLog.push(
    attack.isCrit
      ? `Critical hit vào boss: ${attack.damage} sát thương.`
      : `Anh đánh boss ${attack.damage} sát thương.`,
  );

  const isConditionCheck = nextBoss.currentHp / nextBoss.maxHp <= 0.16;

  if (isConditionCheck) {
    const specialArtifact = getSpecialArtifactStatus(nextPlayer);

    if (specialArtifact.isOwned && specialArtifact.isActivated) {
      turnLog.push("Artifact sáng lên. Boss không thể shutdown anh.");
      return {
        player: nextPlayer,
        boss: nextBoss,
        endingType: ENDINGS.TRUE,
        log: turnLog,
      };
    }

    turnLog.push("Boss kiểm tra artifact... chưa đủ điều kiện.");
    return {
      player: nextPlayer,
      boss: nextBoss,
      endingType: ENDINGS.SHUTDOWN,
      log: turnLog,
    };
  }

  const bossDamage = calculateBossDamage(nextBoss, stats);
  const damageResult = damagePlayer(nextPlayer, bossDamage);
  nextPlayer = damageResult.player;
  turnLog.push(`Boss phản công ${bossDamage} sát thương.`);

  if (damageResult.lostLife && !damageResult.defeated) {
    turnLog.push(`Anh mất 1 mạng, còn ${nextPlayer.lives} mạng.`);
  }

  if (damageResult.defeated) {
    turnLog.push("Boss shutdown anh trước khi artifact kịp sáng.");
    return {
      player: nextPlayer,
      boss: nextBoss,
      endingType: ENDINGS.SHUTDOWN,
      log: turnLog,
    };
  }

  nextPlayer = restoreMana(nextPlayer, stats.manaRegen);

  return {
    player: nextPlayer,
    boss: {
      ...nextBoss,
      log: turnLog,
    },
    endingType: null,
    log: turnLog,
  };
};
