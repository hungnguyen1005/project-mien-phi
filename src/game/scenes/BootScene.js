import Phaser from "phaser";
export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const bar = this.add.graphics();
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.load.on("progress", (value) => {
      bar.clear();
      bar.fillStyle(0x2d1f3d, 1);
      bar.fillRect(w / 2 - 150, h / 2 - 10, 300, 20);
      bar.fillStyle(0xffb7c5, 1);
      bar.fillRect(w / 2 - 150, h / 2 - 10, 300 * value, 20);
    });

    this.load.spritesheet("hoang-run", "/assets/characters/hoang_run_right_v2.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

  }

  create() {
    if (!this.textures.exists("hoang-run")) {
      this.createPlaceholderSprite();
    }

    this.anims.create({
      key: "hoang-run",
      frames: this.anims.generateFrameNumbers("hoang-run", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    const startLevel = this.registry.get("startLevel") ?? 0;
    const progress = this.registry.get("progress");

    if (progress?.completed) {
      this.scene.start("EndingScene");
    } else if (startLevel >= 4) {
      this.scene.start("FinalScene");
    } else {
      this.scene.start("MemoryLevelScene", { levelIndex: startLevel });
    }
  }

  createPlaceholderSprite() {
    const frameW = 256;
    const frameH = 256;
    const canvas = this.textures.createCanvas("hoang-run", frameW * 6, frameH);
    const ctx = canvas.getContext();

    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = "#ffb7c5";
      ctx.fillRect(i * frameW + 40, 40, frameW - 80, frameH - 80);
      ctx.fillStyle = "#3d2314";
      ctx.beginPath();
      ctx.arc(i * frameW + frameW / 2, 90, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe4b5";
      ctx.font = "20px monospace";
      ctx.fillText("Hoàng", i * frameW + frameW / 2 - 36, frameH - 50);
      ctx.fillStyle = "#ff6b8a";
      ctx.fillRect(i * frameW + 60 + i * 8, frameH - 120, 40, 60);
    }

    canvas.refresh();
  }
}
