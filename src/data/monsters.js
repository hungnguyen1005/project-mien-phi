export const monsterTemplates = {
  doubt_slime: {
    id: "doubt_slime",
    name: "Slime Nghĩ Nhiều",
    icon: "🫧",
    baseHp: 70,
    baseDamage: 8,
    expReward: 22,
  },
  lag_bat: {
    id: "lag_bat",
    name: "Dơi Mạng Lag",
    icon: "📶",
    baseHp: 58,
    baseDamage: 10,
    expReward: 24,
  },
  jealous_imp: {
    id: "jealous_imp",
    name: "Quỷ Ghen Nhỏ Xíu",
    icon: "😈",
    baseHp: 88,
    baseDamage: 11,
    expReward: 28,
  },
  distance_wraith: {
    id: "distance_wraith",
    name: "Bóng Yêu Xa",
    icon: "🌫️",
    baseHp: 105,
    baseDamage: 13,
    expReward: 34,
  },
  memory_knight: {
    id: "memory_knight",
    name: "Kỵ Sĩ Ký Ức",
    icon: "🗡️",
    baseHp: 130,
    baseDamage: 15,
    expReward: 42,
  },
  steam_mimic: {
    id: "steam_mimic",
    name: "Rương Steam Giả",
    icon: "🎮",
    baseHp: 145,
    baseDamage: 17,
    expReward: 48,
  },
};

export const finalBossTemplate = {
  id: "shutdown_boss",
  name: "Boss Shutdown",
  icon: "💔",
  baseHp: 520,
  baseDamage: 25,
  phases: [
    {
      id: "phase_1",
      threshold: 1,
      name: "Kiểm tra ký ức",
      damageMultiplier: 1,
    },
    {
      id: "phase_2",
      threshold: 0.5,
      name: "Tín hiệu yếu dần",
      damageMultiplier: 1.25,
    },
    {
      id: "condition_check",
      threshold: 0.16,
      name: "Điều kiện cuối cùng",
      damageMultiplier: 1.5,
    },
  ],
};

export const getMonsterTemplate = (monsterId) => monsterTemplates[monsterId];
