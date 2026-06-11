import Phaser from "phaser";
import { GAME_CONFIG } from "../../data/gameConfig";
import { finalPathConfig } from "../../data/levels";
import { dialogues } from "../../data/dialogues";
import Player from "../objects/Player";
import { drawBackground, createGround } from "../utils/levelBuilder";

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super("EndingScene");
  }

  create() {
    const { width, height } = GAME_CONFIG;

    drawBackground(this, finalPathConfig);
    this.ground = createGround(this);

    this.player = new Player(this, width - 220, height - 60);
    this.player.setFlipX(true);
    this.player.anims.stop();
    this.player.setFrame(0);

    this.tan = this.createTanSprite(width - 120, height - 60);
    this.loveEffects = [];

    this.runEndingSequence();
  }

  createTanSprite(x, y) {
    const g = this.add.graphics();
    g.fillStyle(0xffb7c5, 1);
    g.fillRect(x - 15, y - 90, 30, 50);
    g.fillStyle(0x3d2314, 1);
    g.fillCircle(x, y - 100, 18);
    g.fillStyle(0xffe4b5, 1);
    g.fillCircle(x, y - 102, 12);

    const label = this.add
      .text(x, y - 130, "em Tấn", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#ffe4b5",
      })
      .setOrigin(0.5);

    return { g, label, x, y };
  }

  async runEndingSequence() {
    const steps = [
      { key: "ending_arrival", action: "talk" },
      { key: "ending_sit", action: "sit" },
      { key: "ending_ask_day", action: "talk" },
      { key: "ending_ask_tired", action: "talk" },
      { key: "ending_wipe", action: "wipe" },
      { key: "ending_kiss", action: "kiss" },
      { key: "ending_love_damage", action: "love_damage" },
      { key: "ending_reward", action: "reward" },
    ];

    for (const step of steps) {
      await this.runStep(step);
    }

    const onGameComplete = this.registry.get("onGameComplete");
    onGameComplete?.();
  }

  runStep(step) {
    return new Promise((resolve) => {
      const lines = dialogues[step.key] || [];

      const afterDialogue = () => {
        switch (step.action) {
          case "sit":
            this.tweens.add({
              targets: this.player,
              x: this.tan.x - 50,
              duration: 800,
              ease: "Sine.easeOut",
            });
            break;
          case "wipe":
            this.showSparkles(this.tan.x, this.tan.y - 80);
            break;
          case "kiss":
            this.showKissEffect();
            break;
          case "love_damage":
            this.showLoveDamage();
            break;
          case "reward":
            this.showRewardButton(resolve);
            return;
          default:
            break;
        }
        this.time.delayedCall(600, resolve);
      };

      if (lines.length > 0) {
        const onDialogue = this.registry.get("onDialogue");
        onDialogue ? onDialogue(lines, afterDialogue) : afterDialogue();
      } else {
        afterDialogue();
      }
    });
  }

  showSparkles(x, y) {
    for (let i = 0; i < 8; i++) {
      const s = this.add
        .text(x + Phaser.Math.Between(-30, 30), y + Phaser.Math.Between(-20, 20), "✨", {
          fontSize: "20px",
        })
        .setAlpha(0.8);
      this.tweens.add({
        targets: s,
        y: s.y - 40,
        alpha: 0,
        duration: 1000,
        onComplete: () => s.destroy(),
      });
    }
  }

  showKissEffect() {
    const heart = this.add
      .text(
        (this.player.x + this.tan.x) / 2,
        this.player.y - 120,
        "💛",
        { fontSize: "48px" }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: heart,
      scale: 2,
      alpha: 0,
      duration: 1200,
      ease: "Sine.easeOut",
      onComplete: () => heart.destroy(),
    });

    this.showSparkles((this.player.x + this.tan.x) / 2, this.player.y - 100);
  }

  showLoveDamage() {
    const dmg = this.add
      .text(this.player.x, this.player.y - 160, "💘 +9999", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ff6b8a",
        stroke: "#fff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: dmg,
      y: dmg.y - 60,
      alpha: 0,
      duration: 1500,
    });

    this.tweens.add({
      targets: this.player,
      tint: 0xff9999,
      duration: 200,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.player.clearTint(),
    });

    this.player.setScale(0.45);
    this.tweens.add({
      targets: this.player,
      scaleX: 0.5,
      scaleY: 0.4,
      duration: 300,
      yoyo: true,
      repeat: 1,
    });
  }

  showRewardButton(resolve) {
    const btn = this.add
      .text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 80, "[ Open Letter ]", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffe4b5",
        backgroundColor: "#4a2040",
        padding: { x: 16, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ color: "#ffb7c5" }));
    btn.on("pointerout", () => btn.setStyle({ color: "#ffe4b5" }));
    btn.on("pointerdown", () => {
      const saveProgress = this.registry.get("saveProgress");
      saveProgress?.("completed");
      resolve();
    });
  }
}
