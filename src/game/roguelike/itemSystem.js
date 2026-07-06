import { getItemById, items, SPECIAL_ARTIFACT_ID } from "../../data/items";
import { clampPlayerVitals, spendMana } from "./playerState";

const sampleUnique = (pool, count) => {
  const copy = [...pool];
  const result = [];

  while (copy.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
};

const toChoice = (template, player) => {
  const owned = player.items.find((item) => item.id === template.id);
  const nextLevel = owned ? owned.level + 1 : 1;

  return {
    ...template,
    level: nextLevel,
    owned: Boolean(owned),
    choiceLabel: owned ? `Nâng lên Lv.${nextLevel}` : "Nhận mới",
  };
};

export const getUpgradeChoices = (player, count = 3) => {
  const eligibleItems = items.filter(
    (item) => !item.unlockAtLevel || player.level >= item.unlockAtLevel,
  );

  let choices = sampleUnique(eligibleItems, count);
  const ownsSpecialArtifact = player.items.some((item) => item.id === SPECIAL_ARTIFACT_ID);
  const specialArtifact = getItemById(SPECIAL_ARTIFACT_ID);

  if (!ownsSpecialArtifact && player.level >= specialArtifact.unlockAtLevel) {
    const alreadyIncluded = choices.some((choice) => choice.id === SPECIAL_ARTIFACT_ID);
    if (!alreadyIncluded) {
      choices = [specialArtifact, ...choices.filter((choice) => choice.id !== SPECIAL_ARTIFACT_ID)];
      choices = choices.slice(0, count);
    }
  }

  return choices.map((choice) => toChoice(choice, player));
};

export const applyItemChoice = (player, itemId) => {
  const template = getItemById(itemId);
  const existingItem = player.items.find((item) => item.id === itemId);

  if (existingItem) {
    return clampPlayerVitals({
      ...player,
      items: player.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              level: item.level + 1,
            }
          : item,
      ),
    });
  }

  return clampPlayerVitals({
    ...player,
    items: [
      ...player.items,
      {
        ...template,
        isOwned: true,
        isActivated: false,
      },
    ],
  });
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
      message: "Anh chưa nhặt artifact này.",
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
