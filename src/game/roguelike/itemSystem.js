import {
  SPECIAL_ARTIFACT_ID,
  getItemById,
  itemTypes,
  items,
  rarities,
} from "../../data/items";
import { clampPlayerVitals, spendMana } from "./playerState";

const rarityWeightsByStage = {
  1: [
    [rarities.COMMON, 70],
    [rarities.RARE, 28],
    [rarities.EPIC, 2],
    [rarities.ULTIMATE, 0],
  ],
  2: [
    [rarities.COMMON, 55],
    [rarities.RARE, 38],
    [rarities.EPIC, 7],
    [rarities.ULTIMATE, 0],
  ],
  3: [
    [rarities.COMMON, 40],
    [rarities.RARE, 45],
    [rarities.EPIC, 14],
    [rarities.ULTIMATE, 1],
  ],
  4: [
    [rarities.COMMON, 25],
    [rarities.RARE, 45],
    [rarities.EPIC, 27],
    [rarities.ULTIMATE, 3],
  ],
  5: [
    [rarities.COMMON, 15],
    [rarities.RARE, 40],
    [rarities.EPIC, 40],
    [rarities.ULTIMATE, 5],
  ],
};

const getTypeWeights = (player) => {
  const hasWeapon = player.items.some((item) => item.type === itemTypes.WEAPON);
  const hasArmor = player.items.some((item) => item.type === itemTypes.ARMOR);
  const artifactCount = player.items.filter((item) => item.type === itemTypes.ARTIFACT).length;

  if (!hasWeapon) {
    return [
      [itemTypes.WEAPON, 50],
      [itemTypes.ARMOR, 20],
      [itemTypes.ARTIFACT, 30],
    ];
  }

  if (!hasArmor) {
    return [
      [itemTypes.WEAPON, 25],
      [itemTypes.ARMOR, 45],
      [itemTypes.ARTIFACT, 30],
    ];
  }

  if (artifactCount < 3) {
    return [
      [itemTypes.WEAPON, 20],
      [itemTypes.ARMOR, 15],
      [itemTypes.ARTIFACT, 65],
    ];
  }

  return [
    [itemTypes.WEAPON, 18],
    [itemTypes.ARMOR, 12],
    [itemTypes.ARTIFACT, 70],
  ];
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

const isWeaponAllowedForClass = (item, player) =>
  item.type !== itemTypes.WEAPON ||
  item.classTypes?.includes(player.character.classType);

const isEligible = (item, player, chosenIds) => {
  if (chosenIds.has(item.id)) {
    return false;
  }

  if (item.unlockAtLevel && player.level < item.unlockAtLevel) {
    return false;
  }

  if (!isWeaponAllowedForClass(item, player)) {
    return false;
  }

  return !player.items.some((ownedItem) => ownedItem.id === item.id);
};

const getTypeCap = (type, player) => {
  const hasType = player.items.some((item) => item.type === type);

  if (type === itemTypes.WEAPON || type === itemTypes.ARMOR) {
    return hasType ? 1 : 2;
  }

  return 3;
};

const getCandidatePool = (player, chosenIds, type, rarity) => {
  const basePool = items.filter((item) => item.type === type && isEligible(item, player, chosenIds));
  const rarityPool = basePool.filter((item) => item.rarity === rarity);

  return rarityPool.length > 0 ? rarityPool : basePool;
};

const toChoice = (template, player) => {
  const currentWeapon = player.items.find((item) => item.type === itemTypes.WEAPON);
  const currentArmor = player.items.find((item) => item.type === itemTypes.ARMOR);
  const artifacts = player.items.filter((item) => item.type === itemTypes.ARTIFACT);
  const needsReplacement = template.type === itemTypes.ARTIFACT && artifacts.length >= 3;

  let choiceLabel = "Nhận mới";

  if (template.type === itemTypes.WEAPON) {
    choiceLabel = currentWeapon ? `Thay ${currentWeapon.name}` : "Trang bị vũ khí";
  }

  if (template.type === itemTypes.ARMOR) {
    choiceLabel = currentArmor ? `Thay ${currentArmor.name}` : "Trang bị giáp";
  }

  if (needsReplacement) {
    choiceLabel = "Chọn artifact để thay";
  }

  if (template.type === itemTypes.ARTIFACT && !needsReplacement) {
    choiceLabel = `Artifact ${artifacts.length + 1}/3`;
  }

  return {
    ...template,
    owned: false,
    choiceLabel,
    needsReplacement,
    replacementOptions: needsReplacement ? artifacts : [],
  };
};

export const getUpgradeChoices = (player, count = 3, stageNumber = 1) => {
  const chosen = [];
  const chosenIds = new Set();
  const typeCounts = {
    [itemTypes.WEAPON]: 0,
    [itemTypes.ARMOR]: 0,
    [itemTypes.ARTIFACT]: 0,
  };
  const typeWeights = getTypeWeights(player);
  const rarityWeights = rarityWeightsByStage[stageNumber] ?? rarityWeightsByStage[5];

  let attempts = 0;

  while (chosen.length < count && attempts < 160) {
    attempts += 1;
    const type = chooseWeighted(typeWeights);

    if (typeCounts[type] >= getTypeCap(type, player)) {
      continue;
    }

    const rarity = chooseWeighted(rarityWeights);
    const pool = getCandidatePool(player, chosenIds, type, rarity);

    if (pool.length === 0) {
      continue;
    }

    const picked = sampleOne(pool);
    chosen.push(picked);
    chosenIds.add(picked.id);
    typeCounts[type] += 1;
  }

  if (chosen.length < count) {
    const fallbackPool = items.filter(
      (item) =>
        isEligible(item, player, chosenIds) &&
        typeCounts[item.type] < getTypeCap(item.type, player),
    );

    while (chosen.length < count && fallbackPool.length > 0) {
      const picked = fallbackPool.splice(Math.floor(Math.random() * fallbackPool.length), 1)[0];
      chosen.push(picked);
      chosenIds.add(picked.id);
      typeCounts[picked.type] += 1;
    }
  }

  return chosen.map((choice) => toChoice(choice, player));
};

export const applyItemChoice = (player, itemId, replacedArtifactId = null) => {
  const template = getItemById(itemId);

  if (!template) {
    return player;
  }

  const nextItem = {
    ...template,
    isOwned: true,
    isActivated: false,
  };

  if (template.type === itemTypes.WEAPON || template.type === itemTypes.ARMOR) {
    return clampPlayerVitals({
      ...player,
      items: [
        ...player.items.filter((item) => item.type !== template.type),
        nextItem,
      ],
    });
  }

  if (template.type === itemTypes.ARTIFACT) {
    const artifacts = player.items.filter((item) => item.type === itemTypes.ARTIFACT);
    const nonArtifacts = player.items.filter((item) => item.type !== itemTypes.ARTIFACT);

    if (artifacts.length < 3) {
      return clampPlayerVitals({
        ...player,
        items: [...player.items, nextItem],
      });
    }

    const artifactIdToReplace = replacedArtifactId ?? artifacts[0]?.id;
    const nextArtifacts = artifacts
      .filter((artifact) => artifact.id !== artifactIdToReplace)
      .concat(nextItem)
      .slice(-3);

    return clampPlayerVitals({
      ...player,
      items: [...nonArtifacts, ...nextArtifacts],
    });
  }

  return player;
};

export const getOwnedItem = (player, itemId) =>
  player.items.find((item) => item.id === itemId);

export const getSpecialArtifactStatus = (player) => {
  const artifact = getOwnedItem(player, SPECIAL_ARTIFACT_ID);

  return {
    artifact,
    isOwned: Boolean(artifact),
    isActivated: Boolean(artifact?.isActivated),
  };
};

export const activateArtifact = (player, itemId) => {
  const artifact = getOwnedItem(player, itemId);

  if (!artifact) {
    return {
      player,
      success: false,
      message: "Chưa sở hữu artifact này.",
    };
  }

  if (!artifact.isActive) {
    return {
      player,
      success: false,
      message: "Món này là nội tại, không cần kích hoạt.",
    };
  }

  if (artifact.isActivated) {
    return {
      player,
      success: true,
      message: `${artifact.name} đang sáng rồi.`,
    };
  }

  const cost = artifact.activeCost ?? 0;

  if (player.mana < cost) {
    return {
      player,
      success: false,
      message: `Cần ${cost} mana để kích hoạt ${artifact.name}.`,
    };
  }

  const nextPlayer = spendMana(
    {
      ...player,
      items: player.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isActivated: true,
            }
          : item,
      ),
    },
    cost,
  );

  return {
    player: nextPlayer,
    success: true,
    message: `${artifact.name} đã được kích hoạt.`,
  };
};
