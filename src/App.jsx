import { useCallback, useEffect, useRef, useState } from "react";
import LandingPage from "./components/LandingPage";
import MemoryLogin from "./components/MemoryLogin";
import IntroStory from "./components/IntroStory";
import PhaserGame from "./components/PhaserGame";
import DialogueBox from "./components/DialogueBox";
import LetterModal from "./components/LetterModal";
import AudioToggle from "./components/AudioToggle";
import { useGameProgress } from "./hooks/useGameProgress";
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
  const [volume, setVolume] = useState(0.75);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [dialogue, setDialogue] = useState({ visible: false, lines: [] });
  const [gameKey, setGameKey] = useState(0);
  const bgmRef = useRef(null);
  const dialogueDoneRef = useRef(null);
  const { progress, saveProgress, resetProgress } = useGameProgress();

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = !audioEnabled;

    if (audioEnabled && currentMusic?.src) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [audioEnabled, currentMusic, volume]);

  const handleBegin = () => {
    setAudioEnabled(true);
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
    setCurrentMusic(null);
    bgmRef.current?.pause();
    if (bgmRef.current) bgmRef.current.currentTime = 0;
  };

  const handleSparkle = useCallback(() => {}, []);

  return (
    <main className="app">
      <audio ref={bgmRef} src={currentMusic?.src || ""} loop preload="auto" />

      {screen !== SCREENS.LANDING && currentMusic && (
        <AudioToggle
          enabled={audioEnabled}
          onToggle={setAudioEnabled}
          audioRef={bgmRef}
          trackTitle={currentMusic.title}
          volume={volume}
          onVolumeChange={setVolume}
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
          onSceneMusicChange={setCurrentMusic}
        />
      )}

      <DialogueBox
        lines={dialogue.lines}
        visible={dialogue.visible}
        onComplete={handleDialogueComplete}
      />

      {screen === SCREENS.LETTER && (
        <LetterModal
          open
          onReplay={handleReplay}
          onClose={() => setScreen(SCREENS.LETTER)}
        />
      )}
    </main>
  );
}
