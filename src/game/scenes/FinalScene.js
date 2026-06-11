import Phaser from "phaser";
import { GAME_CONFIG } from "../../data/gameConfig";
import { finalPathConfig } from "../../data/levels";
import { dialogues } from "../../data/dialogues";
import Player from "../objects/Player";
import { drawBackground, createGround } from "../utils/levelBuilder";

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super("FinalScene");
  }

  create() {
    const { width, height } = GAME_CONFIG;
    this.registry.get("onSceneMusicChange")?.(finalPathConfig.music);

    drawBackground(this, finalPathConfig);
    this.ground = createGround(this);

    this.add
      .text(20, 16, finalPathConfig.name, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffe4b5",
      })
      .setScrollFactor(0);

    this.player = new Player(this, 80, height - 60);
    this.physics.add.collider(this.player, this.ground);

    this.keys = {
      a: this.input.keyboard.addKey("A"),
      d: this.input.keyboard.addKey("D"),
      left: this.input.keyboard.addKey("LEFT"),
      right: this.input.keyboard.addKey("RIGHT"),
      space: this.input.keyboard.addKey("SPACE"),
    };

    this.textIndex = 0;
    this.textShown = false;
    this.dialogueActive = false;
    this.pathLines = dialogues.final_path;

    this.finishZone = this.add
      .rectangle(width - 100, height - 120, 120, 200, 0xffb7c5, 0.2)
      .setOrigin(0.5, 1);
    this.physics.add.existing(this.finishZone, true);

    this.add
      .text(width - 100, height - 200, "em Tấn 💛", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffe4b5",
      })
      .setOrigin(0.5);

    this.physics.add.overlap(this.player, this.finishZone, () => {
      if (!this.finished) {
        this.finished = true;
        this.scene.start("EndingScene");
      }
    });
  }

  showNextPathText() {
    if (this.textIndex >= this.pathLines.length) return;

    const line = this.pathLines[this.textIndex];
    this.textIndex++;

    const txt = this.add
      .text(GAME_CONFIG.width / 2, 100 + this.textIndex * 5, line, {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#fff5e6",
        backgroundColor: "#00000066",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: txt,
      alpha: 1,
      y: txt.y - 10,
      duration: 600,
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          this.tweens.add({ targets: txt, alpha: 0, duration: 400 });
        });
      },
    });
  }

  update() {
    if (this.dialogueActive || this.finished) return;

    const left = this.keys.a.isDown || this.keys.left.isDown;
    const right = this.keys.d.isDown || this.keys.right.isDown;
    const jump = this.keys.space.isDown;

    this.player.update({ left, right, jump, interact: false });

    if (right && this.player.x > 150 + this.textIndex * 140 && this.textIndex < this.pathLines.length) {
      if (!this.textShown) {
        this.textShown = true;
        this.showNextPathText();
        this.time.delayedCall(1200, () => {
          this.textShown = false;
        });
      }
    }
  }
}
