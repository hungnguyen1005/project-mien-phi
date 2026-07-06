import { gameDialogues } from "../../data/dialogues";
import { ENDINGS } from "./gameState";

export const getEndingCutscene = (endingType) => {
  if (endingType === ENDINGS.TRUE) {
    return {
      id: "true_ending",
      title: "True Ending",
      lines: gameDialogues.true_ending,
    };
  }

  return {
    id: "shutdown_ending",
    title: "Shutdown Ending",
    lines: gameDialogues.shutdown_ending,
  };
};

export const getStageOpeningDialogue = (stage) => gameDialogues[stage.dialogueKey] ?? [];

export const getBossIntroDialogue = () => gameDialogues.boss_intro;
