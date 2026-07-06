import { getMonsterTemplate } from "../../data/monsters";
import { calculatePlayerPowerLevel } from "./playerState";

const difficultyMultipliers = {
  easy: {
    level: 0.82,
    hp: 0.9,
    damage: 0.86,
  },
  hard: {
    level: 1.34,
    hp: 1.42,
    damage: 1.36,
  },
};

export const scaleMonster = (monsterTemplate, stage, playerPowerLevel, index = 0) => {
  const multipliers = difficultyMultipliers[stage.difficulty] ?? difficultyMultipliers.easy;
  const stagePressure = stage.stageNumber * (stage.difficulty === "hard" ? 2.25 : 1.45);
  const monsterLevel = Math.max(
    1,
    Math.round(playerPowerLevel * multipliers.level + stagePressure + index * 1.35),
  );

  const maxHp = Math.round(
    monsterTemplate.baseHp * multipliers.hp * (1 + monsterLevel * 0.075),
  );
  const damage = Math.round(
    monsterTemplate.baseDamage * multipliers.damage * (1 + monsterLevel * 0.045),
  );

  return {
    ...monsterTemplate,
    instanceId: `${stage.id}_${monsterTemplate.id}_${index}`,
    level: monsterLevel,
    maxHp,
    currentHp: maxHp,
    damage,
    expReward: Math.round(monsterTemplate.expReward * (1 + monsterLevel * 0.035)),
  };
};

export const buildScaledMonsters = (stage, player) => {
  const playerPowerLevel = calculatePlayerPowerLevel(player);

  return stage.monsterIds.map((monsterId, index) =>
    scaleMonster(getMonsterTemplate(monsterId), stage, playerPowerLevel, index),
  );
};

export const getDifficultyLabel = (difficulty) =>
  difficulty === "hard" ? "Hard map" : "Easy map";

export const getMonsterScalingPreview = (stage, player) => {
  const playerPowerLevel = calculatePlayerPowerLevel(player);
  const multipliers = difficultyMultipliers[stage.difficulty] ?? difficultyMultipliers.easy;

  return {
    playerPowerLevel,
    expectedMonsterLevel:
      stage.difficulty === "hard"
        ? Math.round(playerPowerLevel * multipliers.level + stage.stageNumber * 2.25)
        : Math.round(playerPowerLevel * multipliers.level + stage.stageNumber * 1.45),
    hpMultiplier: multipliers.hp,
    damageMultiplier: multipliers.damage,
  };
};
