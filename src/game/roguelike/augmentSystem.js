import { augmentRarities, augments, getAugmentById } from "../../data/augments";
import { SPECIAL_ARTIFACT_ID } from "../../data/items";
import { clampPlayerVitals, getPlayerStats, healPlayer, restoreMana } from "./playerState";

const rarityWeightsByStage = {
  1: [
    [augmentRarities.COMMON, 70],
    [augmentRarities.RARE, 30],
    [augmentRarities.EPIC, 0],
  ],
  2: [
    [augmentRarities.COMMON, 50],
    [augmentRarities.RARE, 40],
    [augmentRarities.EPIC, 10],
  ],
  3: [
    [augmentRarities.COMMON, 30],
    [augmentRarities.RARE, 50],
    [augmentRarities.EPIC, 20],
  ],
  4: [
    [augmentRarities.COMMON, 15],
    [augmentRarities.RARE, 45],
    [augmentRarities.EPIC, 40],
  ],
  5: [
    [augmentRarities.COMMON, 0],
    [augmentRarities.RARE, 35],
    [augmentRarities.EPIC, 65],
  ],
};

const chooseWeighted = (weightedEntries) => {
  const total = weightedEntries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [value, weight] of weightedEntries) {
    roll -= weight;
    if (roll <= 0) {
      return value;
    }
  }

  return weightedEntries.at(-1)?.[0];
};

const sampleOne = (pool) => pool[Math.floor(Math.random() * pool.length)];

export const getAugmentChoices = (stage, player, count = 3) => {
  const stageNumber = stage?.stageNumber ?? 1;
  const rarityWeights = rarityWeightsByStage[stageNumber] ?? rarityWeightsByStage[5];
  const ownedIds = new Set(player.augments.map((augment) => augment.id));
  const chosen = [];
  const chosenIds = new Set();

  let attempts = 0;

  while (chosen.length < count && attempts < 120) {
    attempts += 1;
    const rarity = chooseWeighted(rarityWeights);
    const rarityPool = augments.filter(
      (augment) =>
        augment.rarity === rarity && !ownedIds.has(augment.id) && !chosenIds.has(augment.id),
    );
    const fallbackPool = augments.filter(
      (augment) => !ownedIds.has(augment.id) && !chosenIds.has(augment.id),
    );
    const pool = rarityPool.length > 0 ? rarityPool : fallbackPool;

    if (pool.length === 0) {
      break;
    }

    const picked = sampleOne(pool);
    chosen.push(picked);
    chosenIds.add(picked.id);
  }

  return chosen;
};

export const applyAugmentReward = (player, augmentId) => {
  const augment = getAugmentById(augmentId);

  if (!augment || player.augments.some((ownedAugment) => ownedAugment.id === augmentId)) {
    return player;
  }

  return clampPlayerVitals({
    ...player,
    augments: [
      ...player.augments,
      {
        ...augment,
        stacks: 1,
      },
    ],
  });
};

const applyEternalCoreGrowth = (player) => {
  const hasEternalCore = player.items.some((item) => item.id === SPECIAL_ARTIFACT_ID);

  if (!hasEternalCore) {
    return player;
  }

  const currentGrowth = player.runGrowth ?? {
    damageBonusPercent: 0,
    maxHpPercentBonus: 0,
  };

  return {
    ...player,
    runGrowth: {
      damageBonusPercent: currentGrowth.damageBonusPercent + 0.03,
      maxHpPercentBonus: currentGrowth.maxHpPercentBonus + 0.03,
    },
  };
};

export const applyStageClearRecovery = (player) => {
  const scaledPlayer = clampPlayerVitals(applyEternalCoreGrowth(player));
  const stats = getPlayerStats(scaledPlayer);
  const healed = healPlayer(scaledPlayer, stats.maxHp * stats.stageClearHealPercent);

  return restoreMana(healed, Math.max(10, stats.maxMana * 0.12));
};
