export const getExpToNextLevel = (level) => 52 + (level - 1) * 28;

export const grantExperience = (player, rawAmount, expGainBonus = 0) => {
  let exp = player.exp + Math.round(rawAmount * (1 + expGainBonus));
  let level = player.level;
  let pendingUpgradeLevels = player.pendingUpgradeLevels;
  let leveledUp = false;

  while (exp >= getExpToNextLevel(level)) {
    exp -= getExpToNextLevel(level);
    level += 1;
    pendingUpgradeLevels += 1;
    leveledUp = true;
  }

  return {
    player: {
      ...player,
      exp,
      level,
      pendingUpgradeLevels,
    },
    gainedExp: Math.round(rawAmount * (1 + expGainBonus)),
    leveledUp,
  };
};

export const consumePendingUpgrade = (player) => ({
  ...player,
  pendingUpgradeLevels: Math.max(0, player.pendingUpgradeLevels - 1),
});
