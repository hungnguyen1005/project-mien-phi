import { useRoguelikeGame } from "../../hooks/useRoguelikeGame";
import { FLOW } from "../../game/roguelike/gameState";
import AugmentReward from "./AugmentReward";
import BossStage from "./BossStage";
import CharacterSelection from "./CharacterSelection";
import EndingCutscene from "./EndingCutscene";
import IntroPopup from "./IntroPopup";
import NpcQuestion from "./NpcQuestion";
import PasswordScreen from "./PasswordScreen";
import RelationshipQuestion from "./RelationshipQuestion";
import StageDefeat from "./StageDefeat";
import StageScreen from "./StageScreen";
import UpgradeSelection from "./UpgradeSelection";

export default function BirthdayRoguelike() {
  const { state, derived, actions } = useRoguelikeGame();

  if (state.flow === FLOW.PASSWORD) {
    return <PasswordScreen onComplete={actions.completePassword} />;
  }

  if (state.flow === FLOW.INTRO) {
    return <IntroPopup onContinue={actions.continueIntro} />;
  }

  if (state.flow === FLOW.CHARACTER_SELECT) {
    return (
      <CharacterSelection
        selectedCharacterId={state.selectedCharacterId}
        onSelect={actions.selectCharacter}
        onBegin={actions.beginRun}
      />
    );
  }

  if (state.flow === FLOW.NPC_QUESTION) {
    return <NpcQuestion onComplete={actions.startFirstStage} />;
  }

  if (state.flow === FLOW.STAGE) {
    return (
      <StageScreen
        state={state}
        derived={derived}
        onAttack={actions.attackStage}
        onActivateArtifact={actions.activateOwnedArtifact}
      />
    );
  }

  if (state.flow === FLOW.UPGRADE) {
    return (
      <UpgradeSelection
        choices={state.pendingUpgradeChoices}
        onChoose={actions.chooseUpgrade}
      />
    );
  }

  if (state.flow === FLOW.RELATIONSHIP_QUESTION) {
    return (
      <RelationshipQuestion
        question={state.pendingQuestion}
        onAnswer={actions.answerRelationshipQuestion}
      />
    );
  }

  if (state.flow === FLOW.AUGMENT_REWARD) {
    return (
      <AugmentReward
        choices={state.pendingAugmentChoices}
        questionResult={state.questionResult}
        nextDifficulty={state.nextDifficulty}
        isFinalStage={state.currentStage.stageNumber >= 5}
        onChoose={actions.claimAugmentAndContinue}
      />
    );
  }

  if (state.flow === FLOW.STAGE_DEFEAT) {
    return (
      <StageDefeat
        onRetry={actions.retryCurrentStage}
        onRestart={actions.restartGame}
      />
    );
  }

  if (state.flow === FLOW.BOSS) {
    return (
      <BossStage
        state={state}
        derived={derived}
        onAttack={actions.attackBoss}
        onActivateArtifact={actions.activateOwnedArtifact}
      />
    );
  }

  if (state.flow === FLOW.ENDING) {
    return (
      <EndingCutscene
        endingType={state.endingType}
        player={state.player}
        onRestart={actions.restartGame}
      />
    );
  }

  return null;
}
