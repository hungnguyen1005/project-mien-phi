import { GAME_CONFIG } from "../../data/gameConfig";
import { memoryWaveIcons } from "../../data/memories";

export function playMemoryWave(scene, onComplete) {
  const { width, height } = GAME_CONFIG;
  const overlay = scene.add
    .rectangle(width / 2, height / 2, width, height, 0x1a0a2e, 0.7)
    .setDepth(100);

  const waveText = scene.add
    .text(width / 2, height / 2 - 40, "Cơn sóng ký ức...", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ffe4b5",
    })
    .setOrigin(0.5)
    .setDepth(101);

  const icons = [];
  memoryWaveIcons.forEach((icon, i) => {
    const t = scene.add
      .text(-50, 120 + i * 36, `${icon.emoji}`, { fontSize: "28px" })
      .setDepth(101);
    icons.push(t);

    scene.tweens.add({
      targets: t,
      x: width + 50,
      duration: 1200 + i * 100,
      delay: i * 80,
      ease: "Sine.easeInOut",
      onComplete: () => t.destroy(),
    });
  });

  scene.tweens.add({
    targets: overlay,
    alpha: 0,
    duration: 600,
    delay: 1800,
    onComplete: () => {
      overlay.destroy();
      waveText.destroy();
      onComplete?.();
    },
  });
}
