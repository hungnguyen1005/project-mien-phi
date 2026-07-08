import { getAugmentById } from "../../data/augments";
import { getCharacterById } from "../../data/characters";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const addEffect = (totals, effect = {}, multiplier = 1) => {
  Object.entries(effect).forEach(([key, value]) => {
    if (typeof value === "number") {
      totals[key] = (totals[key] ?? 0) + value * multiplier;
    } else {
      totals[key] = value;
    }
  });
};

export const createPlayerState = (characterId) => {
  const character = getCharacterById(characterId);

  return {
    characterId,
    character,
    hp: character.baseStats.maxHp,
    mana: character.baseStats.maxMana,
    exp: 0,
    level: 1,
    lives: 3,
    items: [],
    augments: [],
    runGrowth: {
      damageBonusPercent: 0,
      maxHpPercentBonus: 0,
    },
    guardianAegisUsed: false,
    pendingUpgradeLevels: 0,
    isDefeated: false,
  };
};

export const getEffectTotals = (player) => {
  const totals = {};

  player.items.forEach((item) => {
    addEffect(totals, item.effect);
  });

  player.augments.forEach((augment) => {
    const augmentData = getAugmentById(augment.id) ?? augment;
    addEffect(totals, augmentData.effect, augment.stacks ?? 1);
  });

  addEffect(totals, player.runGrowth);

  return totals;
};

export const getPlayerStats = (player) => {
  const base = player.character.baseStats;
  const effects = getEffectTotals(player);

  const maxHp = Math.round(
    (base.maxHp + (effects.maxHpBonus ?? 0)) * (1 + (effects.maxHpPercentBonus ?? 0)),
  );
  const maxMana = Math.round(
    (base.maxMana + (effects.maxManaBonus ?? 0)) * (1 + (effects.maxManaPercentBonus ?? 0)),
  );
  const attack = Math.round(base.attack + (effects.attackBonus ?? 0));
  const defense = Math.round(base.defense + (effects.defenseBonus ?? 0));

  return {
    maxHp,
    maxMana,
    attack,
    defense,
    manaRegen: base.manaRegen + (effects.manaRegenBonus ?? 0),
    critChance: clamp(base.critChance + (effects.critChanceBonus ?? 0), 0, 0.75),
    critDamage:
      1.55 + (player.character.passive?.critDamageBonus ?? 0) + (effects.critDamageBonus ?? 0),
    damageReduction: clamp(effects.damageReductionBonus ?? 0, 0, 0.65),
    damageBonusPercent: effects.damageBonusPercent ?? 0,
    attackSpeedBonus: effects.attackSpeedBonus ?? 0,
    moveSpeed: base.moveSpeed + (effects.moveSpeedBonus ?? 0),
    projectileBonus: effects.projectileBonus ?? 0,
    expGainBonus: effects.expGainBonus ?? 0,
    itemDropBonus: effects.itemDropBonus ?? 0,
    stageClearHealPercent: effects.stageClearHealPercent ?? 0,
    healingReceivedBonus: effects.healingReceivedBonus ?? 0,
    stageManaBonus: (player.character.passive?.stageManaBonus ?? 0) + (effects.stageManaBonus ?? 0),
  };
};

export const clampPlayerVitals = (player) => {
  const stats = getPlayerStats(player);

  return {
    ...player,
    hp: clamp(Math.round(player.hp), 0, stats.maxHp),
    mana: clamp(Math.round(player.mana), 0, stats.maxMana),
  };
};

export const healPlayer = (player, amount) => {
  const stats = getPlayerStats(player);
  const healingMultiplier = Math.max(0, 1 + stats.healingReceivedBonus);

  return {
    ...player,
    hp: clamp(Math.round(player.hp + amount * healingMultiplier), 0, stats.maxHp),
  };
};

export const restoreMana = (player, amount) => {
  const stats = getPlayerStats(player);

  return {
    ...player,
    mana: clamp(Math.round(player.mana + amount), 0, stats.maxMana),
  };
};

export const spendMana = (player, amount) => ({
  ...player,
  mana: clamp(Math.round(player.mana - amount), 0, getPlayerStats(player).maxMana),
});

export const damagePlayer = (player, damage) => {
  const nextHp = Math.round(player.hp - damage);

  if (nextHp > 0) {
    return {
      player: {
        ...player,
        hp: nextHp,
      },
      lostLife: false,
      defeated: false,
    };
  }

  const hasDestinyAegis = player.items.some((item) => item.id === "destiny_aegis");

  if (hasDestinyAegis && !player.guardianAegisUsed) {
    const stats = getPlayerStats(player);

    return {
      player: {
        ...player,
        hp: clamp(Math.round(stats.maxHp * 0.35), 1, stats.maxHp),
        guardianAegisUsed: true,
      },
      lostLife: false,
      defeated: false,
      guardianSaved: true,
    };
  }

  const remainingLives = player.lives - 1;

  if (remainingLives <= 0) {
    return {
      player: {
        ...player,
        hp: 0,
        lives: 0,
        isDefeated: true,
      },
      lostLife: true,
      defeated: true,
    };
  }

  const stats = getPlayerStats(player);
  const reviveBonus = player.character.passive?.reviveHpBonus ?? 0;

  return {
    player: {
      ...player,
      hp: clamp(Math.round(stats.maxHp * 0.62 + reviveBonus), 1, stats.maxHp),
      mana: clamp(Math.round(stats.maxMana * 0.45), 0, stats.maxMana),
      lives: remainingLives,
      isDefeated: false,
    },
    lostLife: true,
    defeated: false,
  };
};

export const preparePlayerForStage = (player) => {
  const clamped = clampPlayerVitals({
    ...player,
    guardianAegisUsed: false,
  });
  const stats = getPlayerStats(clamped);

  return restoreMana(clamped, stats.stageManaBonus);
};

export const restorePlayerForRetry = (player) => {
  const stats = getPlayerStats(player);

  return {
    ...player,
    hp: stats.maxHp,
    mana: stats.maxMana,
    lives: 3,
    isDefeated: false,
  };
};

export const calculatePlayerPowerLevel = (player) => {
  const itemPowerBonus = player.items.reduce((total, item) => {
    return total + (item.powerBonus ?? 0);
  }, 0);

  const augmentPowerBonus = player.augments.reduce((total, augment) => {
    const augmentData = getAugmentById(augment.id) ?? augment;
    return total + (augmentData.powerBonus ?? 0) * (augment.stacks ?? 1);
  }, 0);

  return player.level + itemPowerBonus + augmentPowerBonus;
};

export const getHpPercent = (player) => {
  const stats = getPlayerStats(player);
  return Math.round((player.hp / stats.maxHp) * 100);
};

export const getManaPercent = (player) => {
  const stats = getPlayerStats(player);
  return Math.round((player.mana / stats.maxMana) * 100);
};
