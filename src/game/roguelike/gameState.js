export const FLOW = {
  PASSWORD: "password",
  INTRO: "intro",
  CHARACTER_SELECT: "character_select",
  NPC_QUESTION: "npc_question",
  STAGE: "stage",
  UPGRADE: "upgrade",
  RELATIONSHIP_QUESTION: "relationship_question",
  AUGMENT_REWARD: "augment_reward",
  STAGE_DEFEAT: "stage_defeat",
  BOSS: "boss",
  ENDING: "ending",
};

export const ENDINGS = {
  TRUE: "true",
  SHUTDOWN: "shutdown",
};

export const createInitialGameState = () => ({
  flow: FLOW.PASSWORD,
  selectedCharacterId: null,
  player: null,
  currentStage: null,
  currentStageNumber: 1,
  currentDifficulty: "easy",
  combat: null,
  bossCombat: null,
  pendingQuestion: null,
  pendingAugment: null,
  pendingAugmentChoices: [],
  pendingUpgradeChoices: [],
  nextStageNumber: 1,
  nextDifficulty: "easy",
  stageClearedBeforeUpgrade: false,
  questionResult: null,
  endingType: null,
  notice: "",
  history: [],
});
