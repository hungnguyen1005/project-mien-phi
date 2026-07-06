import { grantExperience } from "./levelSystem";
import {
  damagePlayer,
  getPlayerStats,
  restoreMana,
  spendMana,
} from "./playerState";
import { buildScaledMonsters } from "./scalingSystem";

export const COMBAT_ACTIONS = {
  BASIC: "basic",
  MANA_BURST: "mana_burst",
};

export const MANA_BURST_COST = 22;

export const createStageCombat = (stage, player) => ({
  stageId: stage.id,
  monsters: buildScaledMonsters(stage, player),
  currentMonsterIndex: 0,
  log: ["Stage bắt đầu. Quái đang tới gần."],
  cleared: false,
});

export const getCurrentMonster = (combat) =>
  combat.monsters[combat.currentMonsterIndex] ?? null;

const calculatePlayerDamage = (stats, action) => {
  const actionMultiplier = action === COMBAT_ACTIONS.MANA_BURST ? 1.8 : 1;
  const attackSpeedValue = 1 + stats.attackSpeedBonus * 0.35;
  const projectileValue = 1 + stats.projectileBonus * 0.08;
  const variance = 0.92 + Math.random() * 0.16;
  const isCrit = Math.random() < stats.critChance;
  const critMultiplier = isCrit ? stats.critDamage : 1;
  const damage =
    stats.attack *
    (1 + stats.damageBonusPercent) *
    attackSpeedValue *
    projectileValue *
    actionMultiplier *
    variance *
    critMultiplier;

  return {
    damage: Math.max(1, Math.round(damage)),
    isCrit,
  };
};

const calculateMonsterDamage = (monster, stats) => {
  const rawDamage = Math.max(1, monster.damage - stats.defense);
  return Math.max(1, Math.round(rawDamage * (1 - stats.damageReduction)));
};

export const performStageTurn = (player, combat, action = COMBAT_ACTIONS.BASIC) => {
  const monster = getCurrentMonster(combat);

  if (!monster) {
    return {
      player,
      combat: {
        ...combat,
        cleared: true,
      },
      stageCleared: true,
      leveledUp: false,
      log: ["Stage đã clear rồi."],
    };
  }

  let nextPlayer = player;
  const stats = getPlayerStats(nextPlayer);
  const turnLog = [];

  if (action === COMBAT_ACTIONS.MANA_BURST) {
    if (nextPlayer.mana < MANA_BURST_COST) {
      return {
        player: nextPlayer,
        combat,
        stageCleared: false,
        leveledUp: false,
        log: [`Không đủ mana để dùng Mana Burst. Cần ${MANA_BURST_COST} mana.`],
      };
    }

    nextPlayer = spendMana(nextPlayer, MANA_BURST_COST);
  }

  const attack = calculatePlayerDamage(stats, action);
  const nextMonsterHp = Math.max(0, monster.currentHp - attack.damage);
  const updatedMonster = {
    ...monster,
    currentHp: nextMonsterHp,
  };

  turnLog.push(
    attack.isCrit
      ? `Critical hit! Anh gây ${attack.damage} sát thương.`
      : `Anh gây ${attack.damage} sát thương.`,
  );

  let monsters = combat.monsters.map((entry, index) =>
    index === combat.currentMonsterIndex ? updatedMonster : entry,
  );
  let currentMonsterIndex = combat.currentMonsterIndex;
  let stageCleared = false;
  let leveledUp = false;

  if (updatedMonster.currentHp <= 0) {
    const expResult = grantExperience(nextPlayer, monster.expReward, stats.expGainBonus);
    nextPlayer = restoreMana(expResult.player, Math.max(4, stats.manaRegen * 0.55));
    leveledUp = expResult.leveledUp;
    currentMonsterIndex += 1;
    stageCleared = currentMonsterIndex >= monsters.length;

    turnLog.push(`${monster.name} biến mất. Nhận ${expResult.gainedExp} EXP.`);

    if (leveledUp) {
      turnLog.push(`Level up! Anh lên cấp ${nextPlayer.level}.`);
    }

    if (stageCleared) {
      turnLog.push("Map đã clear. Chuẩn bị câu hỏi ký ức.");
    }
  } else {
    const monsterDamage = calculateMonsterDamage(monster, stats);
    const damageResult = damagePlayer(nextPlayer, monsterDamage);
    nextPlayer = damageResult.player;

    turnLog.push(`${monster.name} đánh lại ${monsterDamage} sát thương.`);

    if (damageResult.lostLife && !damageResult.defeated) {
      turnLog.push(`Anh mất 1 mạng, còn ${nextPlayer.lives} mạng.`);
    }

    if (damageResult.defeated) {
      turnLog.push("Hết mạng rồi. Stage này cần thử lại.");
    } else {
      nextPlayer = restoreMana(nextPlayer, stats.manaRegen);
    }
  }

  return {
    player: nextPlayer,
    combat: {
      ...combat,
      monsters,
      currentMonsterIndex,
      cleared: stageCleared,
      log: turnLog,
    },
    stageCleared,
    leveledUp,
    log: turnLog,
  };
};
