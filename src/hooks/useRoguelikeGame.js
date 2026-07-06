import { useMemo, useState } from "react";
import { getAugmentById } from "../data/augments";
import { getQuestionById, isCorrectAnswer } from "../data/questions";
import { getStageByNumberAndDifficulty } from "../data/stages";
import {
  applyAugmentReward,
  applyStageClearRecovery,
  getAugmentReward,
} from "../game/roguelike/augmentSystem";
import { createBossCombat, performBossTurn } from "../game/roguelike/bossSystem";
import {
  COMBAT_ACTIONS,
  createStageCombat,
  performStageTurn,
} from "../game/roguelike/combatSystem";
import { ENDINGS, FLOW, createInitialGameState } from "../game/roguelike/gameState";
import {
  activateArtifact,
  getSpecialArtifactStatus,
  getUpgradeChoices,
  applyItemChoice,
} from "../game/roguelike/itemSystem";
import { consumePendingUpgrade } from "../game/roguelike/levelSystem";
import {
  calculatePlayerPowerLevel,
  createPlayerState,
  getPlayerStats,
  preparePlayerForStage,
  restorePlayerForRetry,
} from "../game/roguelike/playerState";

const createQuestionState = (state) => ({
  ...state,
  flow: FLOW.RELATIONSHIP_QUESTION,
  pendingQuestion: getQuestionById(state.currentStage.endingQuestionId),
  stageClearedBeforeUpgrade: false,
});

const enterStage = (state, stageNumber, difficulty, playerOverride = state.player) => {
  const stage = getStageByNumberAndDifficulty(stageNumber, difficulty);
  const player = preparePlayerForStage(playerOverride);

  return {
    ...state,
    flow: FLOW.STAGE,
    player,
    currentStage: stage,
    currentStageNumber: stageNumber,
    currentDifficulty: difficulty,
    combat: createStageCombat(stage, player),
    bossCombat: null,
    pendingQuestion: null,
    pendingAugment: null,
    pendingUpgradeChoices: [],
    questionResult: null,
    stageClearedBeforeUpgrade: false,
    notice: "",
  };
};

const enterBoss = (state, playerOverride = state.player) => {
  const player = preparePlayerForStage(playerOverride);

  return {
    ...state,
    flow: FLOW.BOSS,
    player,
    combat: null,
    bossCombat: createBossCombat(player),
    pendingQuestion: null,
    pendingAugment: null,
    questionResult: null,
    notice: "Final boss đang chờ artifact được kích hoạt.",
  };
};

export const useRoguelikeGame = () => {
  const [state, setState] = useState(() => createInitialGameState());

  const derived = useMemo(() => {
    if (!state.player) {
      return {
        playerStats: null,
        playerPowerLevel: 0,
        specialArtifact: {
          artifact: null,
          isOwned: false,
          isActivated: false,
        },
      };
    }

    return {
      playerStats: getPlayerStats(state.player),
      playerPowerLevel: calculatePlayerPowerLevel(state.player),
      specialArtifact: getSpecialArtifactStatus(state.player),
    };
  }, [state.player]);

  const completePassword = () => {
    setState((current) => ({
      ...current,
      flow: FLOW.INTRO,
      notice: "",
    }));
  };

  const continueIntro = () => {
    setState((current) => ({
      ...current,
      flow: FLOW.CHARACTER_SELECT,
    }));
  };

  const selectCharacter = (characterId) => {
    setState((current) => ({
      ...current,
      selectedCharacterId: characterId,
      player: createPlayerState(characterId),
      notice: "",
    }));
  };

  const beginRun = () => {
    setState((current) => ({
      ...current,
      flow: FLOW.NPC_QUESTION,
    }));
  };

  const startFirstStage = (answeredCorrectly) => {
    setState((current) =>
      enterStage(current, 1, answeredCorrectly ? "easy" : "hard", current.player),
    );
  };

  const attackStage = (action = COMBAT_ACTIONS.BASIC) => {
    setState((current) => {
      const result = performStageTurn(current.player, current.combat, action);
      const nextState = {
        ...current,
        player: result.player,
        combat: result.combat,
        notice: result.log.at(-1) ?? "",
      };

      if (result.player.isDefeated) {
        return {
          ...nextState,
          flow: FLOW.STAGE_DEFEAT,
        };
      }

      if (result.player.pendingUpgradeLevels > 0) {
        return {
          ...nextState,
          flow: FLOW.UPGRADE,
          pendingUpgradeChoices: getUpgradeChoices(result.player),
          stageClearedBeforeUpgrade: result.stageCleared,
        };
      }

      if (result.stageCleared) {
        return createQuestionState(nextState);
      }

      return nextState;
    });
  };

  const chooseUpgrade = (itemId) => {
    setState((current) => {
      const upgradedPlayer = consumePendingUpgrade(applyItemChoice(current.player, itemId));
      const nextState = {
        ...current,
        player: upgradedPlayer,
        notice: "Upgrade đã chọn.",
      };

      if (upgradedPlayer.pendingUpgradeLevels > 0) {
        return {
          ...nextState,
          pendingUpgradeChoices: getUpgradeChoices(upgradedPlayer),
        };
      }

      if (current.stageClearedBeforeUpgrade) {
        return createQuestionState({
          ...nextState,
          pendingUpgradeChoices: [],
        });
      }

      return {
        ...nextState,
        flow: FLOW.STAGE,
        pendingUpgradeChoices: [],
      };
    });
  };

  const answerRelationshipQuestion = (answer) => {
    setState((current) => {
      const correct = isCorrectAnswer(current.pendingQuestion, answer);
      const nextDifficulty = correct ? "easy" : "hard";
      const pendingAugment = getAugmentReward(current.currentStage, current.player);

      return {
        ...current,
        flow: FLOW.AUGMENT_REWARD,
        pendingAugment,
        nextStageNumber: current.currentStage.stageNumber + 1,
        nextDifficulty,
        questionResult: {
          answer,
          correct,
          questionId: current.pendingQuestion.id,
        },
        history: [
          ...current.history,
          {
            stageId: current.currentStage.id,
            questionId: current.pendingQuestion.id,
            correct,
            nextDifficulty,
          },
        ],
        notice: correct ? "Đúng rồi, map sau dễ hơn." : "Sai rồi nha, map sau khó hơn đó.",
      };
    });
  };

  const claimAugmentAndContinue = () => {
    setState((current) => {
      const augment = getAugmentById(current.pendingAugment.id);
      const withAugment = applyAugmentReward(current.player, augment.id);
      const recoveredPlayer = applyStageClearRecovery(withAugment);

      if (current.currentStage.stageNumber >= 5) {
        return enterBoss(
          {
            ...current,
            pendingAugment: null,
          },
          recoveredPlayer,
        );
      }

      return enterStage(
        {
          ...current,
          pendingAugment: null,
        },
        current.nextStageNumber,
        current.nextDifficulty,
        recoveredPlayer,
      );
    });
  };

  const activateOwnedArtifact = (itemId) => {
    setState((current) => {
      const result = activateArtifact(current.player, itemId);

      return {
        ...current,
        player: result.player,
        notice: result.message,
      };
    });
  };

  const attackBoss = (action = COMBAT_ACTIONS.BASIC) => {
    setState((current) => {
      const result = performBossTurn(current.player, current.bossCombat, action);
      const nextState = {
        ...current,
        player: result.player,
        bossCombat: result.boss,
        notice: result.log.at(-1) ?? "",
      };

      if (result.endingType === ENDINGS.TRUE || result.endingType === ENDINGS.SHUTDOWN) {
        return {
          ...nextState,
          flow: FLOW.ENDING,
          endingType: result.endingType,
        };
      }

      return nextState;
    });
  };

  const retryCurrentStage = () => {
    setState((current) => {
      const restoredPlayer = restorePlayerForRetry(current.player);
      return enterStage(
        {
          ...current,
          player: restoredPlayer,
        },
        current.currentStageNumber,
        current.currentDifficulty,
        restoredPlayer,
      );
    });
  };

  const restartGame = () => {
    setState(createInitialGameState());
  };

  return {
    state,
    derived,
    actions: {
      completePassword,
      continueIntro,
      selectCharacter,
      beginRun,
      startFirstStage,
      attackStage,
      chooseUpgrade,
      answerRelationshipQuestion,
      claimAugmentAndContinue,
      activateOwnedArtifact,
      attackBoss,
      retryCurrentStage,
      restartGame,
    },
  };
};
