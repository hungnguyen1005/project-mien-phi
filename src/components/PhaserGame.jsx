import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GAME_CONFIG, CONTROLS_HINT } from "../data/gameConfig";
import BootScene from "../game/scenes/BootScene";
import MemoryLevelScene from "../game/scenes/MemoryLevelScene";
import FinalScene from "../game/scenes/FinalScene";
import EndingScene from "../game/scenes/EndingScene";

export default function PhaserGame({
  startLevel = 0,
  progress,
  onDialogue,
  onGameComplete,
  onSparkle,
  saveProgress,
  onSceneMusicChange,
}) {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    if (gameInstanceRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
      backgroundColor: GAME_CONFIG.backgroundColor,
      pixelArt: GAME_CONFIG.pixelArt,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800 },
          debug: false,
        },
      },
      scene: [BootScene, MemoryLevelScene, FinalScene, EndingScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameInstanceRef.current = new Phaser.Game(config);

    const game = gameInstanceRef.current;
    game.registry.set("onDialogue", onDialogue);
    game.registry.set("onGameComplete", onGameComplete);
    game.registry.set("onSparkle", onSparkle);
    game.registry.set("saveProgress", saveProgress);
    game.registry.set("onSceneMusicChange", onSceneMusicChange);
    game.registry.set("startLevel", startLevel);
    game.registry.set("progress", progress);

    return () => {
      gameInstanceRef.current?.destroy(true);
      gameInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const game = gameInstanceRef.current;
    if (!game) return;
    game.registry.set("onDialogue", onDialogue);
    game.registry.set("onGameComplete", onGameComplete);
    game.registry.set("onSparkle", onSparkle);
    game.registry.set("saveProgress", saveProgress);
    game.registry.set("onSceneMusicChange", onSceneMusicChange);
  }, [onDialogue, onGameComplete, onSparkle, saveProgress, onSceneMusicChange]);

  return (
    <div className="game-wrapper">
      <div ref={gameContainerRef} className="game-container" />
      <p className="controls-hint">{CONTROLS_HINT}</p>
    </div>
  );
}
