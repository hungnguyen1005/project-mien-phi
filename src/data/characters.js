export const characters = [
  {
    id: "hoang_knight",
    name: "Hoàng Hiệp Sĩ",
    image: "🛡️",
    style: "Cân bằng, lì đòn, hợp cho lần chơi đầu.",
    color: "#f3b35d",
    baseStats: {
      maxHp: 130,
      maxMana: 70,
      attack: 18,
      defense: 5,
      manaRegen: 7,
      critChance: 0.08,
      moveSpeed: 1,
    },
    passive: {
      name: "Không bỏ cuộc",
      description: "Revive hồi thêm một chút HP.",
      reviveHpBonus: 12,
    },
  },
  {
    id: "baron_ranger",
    name: "Baron Bắn Tim",
    image: "🏹",
    style: "Đánh đau hơn, máu mỏng hơn, hơi liều nhưng ngầu.",
    color: "#6fd1c2",
    baseStats: {
      maxHp: 105,
      maxMana: 80,
      attack: 24,
      defense: 3,
      manaRegen: 8,
      critChance: 0.16,
      moveSpeed: 1.12,
    },
    passive: {
      name: "Bắn một phát nhớ luôn",
      description: "Tăng nhẹ sát thương chí mạng.",
      critDamageBonus: 0.2,
    },
  },
  {
    id: "cuc_vang_mage",
    name: "Cục Vàng Pháp Sư",
    image: "✨",
    style: "Nhiều mana, hợp dùng artifact và kỹ năng.",
    color: "#ff8aa6",
    baseStats: {
      maxHp: 112,
      maxMana: 115,
      attack: 16,
      defense: 4,
      manaRegen: 12,
      critChance: 0.1,
      moveSpeed: 0.98,
    },
    passive: {
      name: "Tim sáng lên",
      description: "Bắt đầu mỗi stage với thêm mana.",
      stageManaBonus: 18,
    },
  },
];

export const getCharacterById = (characterId) =>
  characters.find((character) => character.id === characterId);
