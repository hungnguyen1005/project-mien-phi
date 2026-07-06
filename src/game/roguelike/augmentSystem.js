import { augments, getAugmentById } from "../../data/augments";
import { clampPlayerVitals, getPlayerStats, healPlayer, restoreMana } from "./playerState";

const sampleOne = (pool) => pool[Math.floor(Math.random() * pool.length)];

export const getAugmentReward = (stage, player) => {
  const preferredPool = stage.rewardAugmentPool
    .map((augmentId) => getAugmentById(augmentId))
    .filter(Boolean);
  const ownedIds = new Set(player.augments.map((augment) => augment.id));
  const unownedPreferred = preferredPool.filter((augment) => !ownedIds.has(augment.id));
  const fallbackUnowned = augments.filter((augment) => !ownedIds.has(augment.id));
  const pool = unownedPreferred.length > 0 ? unownedPreferred : fallbackUnowned;

  return sampleOne(pool.length > 0 ? pool : preferredPool);
};

export const applyAugmentReward = (player, augmentId) => {
  const augment = getAugmentById(augmentId);
  const existing = player.augments.find((ownedAugment) => ownedAugment.id === augmentId);

  const nextPlayer = existing
    ? {
        ...player,
        augments: player.augments.map((ownedAugment) =>
          ownedAugment.id === augmentId
            ? {
                ...ownedAugment,
                stacks: ownedAugment.stacks + 1,
              }
            : ownedAugment,
        ),
      }
    : {
        ...player,
        augments: [
          ...player.augments,
          {
            ...augment,
            stacks: 1,
          },
        ],
      };

  return clampPlayerVitals(nextPlayer);
};

export const applyStageClearRecovery = (player) => {
  const stats = getPlayerStats(player);
  const healed = healPlayer(player, stats.maxHp * stats.stageClearHealPercent);

  return restoreMana(healed, Math.max(10, stats.maxMana * 0.12));
};
