import { useCallback, useRef, useState } from "react";
import LandingPage from "./components/LandingPage";
import MemoryLogin from "./components/MemoryLogin";
import IntroStory from "./components/IntroStory";
import PhaserGame from "./components/PhaserGame";
import DialogueBox from "./components/DialogueBox";
import LetterModal from "./components/LetterModal";
import AudioToggle from "./components/AudioToggle";
import { useGameProgress } from "./hooks/useGameProgress";
import { AUDIO } from "./data/gameConfig";
import "./App.css";

const SCREENS = {
  LANDING: "landing",
  LOGIN: "login",
  INTRO: "intro",
  GAME: "game",
  LETTER: "letter",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [dialogue, setDialogue] = useState({ visible: false, lines: [] });
  const [gameKey, setGameKey] = useState(0);
  const bgmRef = useRef(null);
  const dialogueDoneRef = useRef(null);
  const { progress, saveProgress, resetProgress } = useGameProgress();

  const handleBegin = () => {
    setAudioEnabled(true);
    bgmRef.current?.play().catch(() => {});
    setScreen(SCREENS.LOGIN);
  };

  const handleLoginComplete = () => setScreen(SCREENS.INTRO);
  const handleIntroContinue = () => setScreen(SCREENS.GAME);

  const handleDialogue = useCallback((lines, onDone) => {
    dialogueDoneRef.current = onDone;
    setDialogue({ visible: true, lines });
  }, []);

  const handleDialogueComplete = useCallback(() => {
    const done = dialogueDoneRef.current;
    dialogueDoneRef.current = null;
    setDialogue({ visible: false, lines: [] });
    done?.();
  }, []);

  const handleGameComplete = useCallback(() => {
    setScreen(SCREENS.LETTER);
  }, []);

  const handleReplay = () => {
    resetProgress();
    setGameKey((k) => k + 1);
    setScreen(SCREENS.LANDING);
    setAudioEnabled(false);
    bgmRef.current?.pause();
    if (bgmRef.current) bgmRef.current.currentTime = 0;
  };

  const handleSparkle = useCallback(() => {}, []);

  return (
    <main className="app">
      <audio ref={bgmRef} src={AUDIO.bgm} loop preload="auto" />

      {screen !== SCREENS.LANDING && (
        <AudioToggle
          enabled={audioEnabled}
          onToggle={setAudioEnabled}
          audioRef={bgmRef}
        />
      )}

      {screen === SCREENS.LANDING && <LandingPage onBegin={handleBegin} />}

      {screen === SCREENS.LOGIN && <MemoryLogin onComplete={handleLoginComplete} />}

      {screen === SCREENS.INTRO && <IntroStory onContinue={handleIntroContinue} />}

      {screen === SCREENS.GAME && (
        <PhaserGame
          key={gameKey}
          startLevel={progress.level}
          progress={progress}
          onDialogue={handleDialogue}
          onGameComplete={handleGameComplete}
          onSparkle={handleSparkle}
          saveProgress={saveProgress}
        />
      )}

      <DialogueBox
        lines={dialogue.lines}
        visible={dialogue.visible}
        onComplete={handleDialogueComplete}
      />

      <LetterModal
        open={screen === SCREENS.LETTER}
        onReplay={handleReplay}
        onClose={() => setScreen(SCREENS.LETTER)}
      />
    </main>
  );
}
