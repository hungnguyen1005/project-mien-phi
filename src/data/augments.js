export const augments = [
  {
    id: "soft_power",
    name: "Thương Thương +1",
    description: "Tổng sát thương tăng vì được cổ vũ quá trời.",
    effect: {
      damageBonusPercent: 0.1,
    },
    powerBonus: 4,
  },
  {
    id: "video_call_energy",
    name: "Năng Lượng Gọi Video",
    description: "Mana tối đa và hồi mana tăng sau một cuộc gọi dài.",
    effect: {
      maxManaBonus: 24,
      manaRegenBonus: 4,
    },
    powerBonus: 4,
  },
  {
    id: "after_stage_heal",
    name: "Nghỉ Chút Nha",
    description: "Hồi máu sau khi qua mỗi stage.",
    effect: {
      stageClearHealPercent: 0.25,
    },
    powerBonus: 3,
  },
  {
    id: "karaoke_routine",
    name: "Routine Karaoke",
    description: "Tốc đánh tăng vì hai đứa bắt nhịp quá hợp.",
    effect: {
      attackSpeedBonus: 0.12,
      critChanceBonus: 0.04,
    },
    powerBonus: 5,
  },
  {
    id: "distance_runner",
    name: "Chạy Qua Khoảng Cách",
    description: "Tăng tốc độ và né bớt sát thương.",
    effect: {
      moveSpeedBonus: 0.14,
      damageReductionBonus: 0.05,
    },
    powerBonus: 4,
  },
  {
    id: "memory_collector",
    name: "Gom Ký Ức",
    description: "Nhận thêm EXP để lên cấp nhanh hơn.",
    effect: {
      expGainBonus: 0.18,
      itemDropBonus: 0.08,
    },
    powerBonus: 4,
  },
];

export const getAugmentById = (augmentId) =>
  augments.find((augment) => augment.id === augmentId);
