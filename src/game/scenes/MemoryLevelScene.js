import Phaser from "phaser";
import { GAME_CONFIG } from "../../data/gameConfig";
import { memoryLevels } from "../../data/levels";
import { dialogues } from "../../data/dialogues";
import Player from "../objects/Player";
import {
  drawBackground,
  createGround,
  createInteractable,
  createCollectible,
} from "../utils/levelBuilder";
import { playMemoryWave } from "../utils/MemoryWave";

export default class MemoryLevelScene extends Phaser.Scene {
  constructor() {
    super("MemoryLevelScene");
  }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.level = memoryLevels[this.levelIndex];
    this.collected = 0;
    this.totalCollectibles = 0;
    this.levelComplete = false;
    this.dialogueActive = false;
    this.interactables = [];
    this.collectibles = [];
  }

  create() {
    const { width, height } = GAME_CONFIG;

    drawBackground(this, this.level);
    this.ground = createGround(this);

    this.add
      .text(20, 16, `${this.level.name}`, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffe4b5",
      })
      .setScrollFactor(0);

    this.add
      .text(20, 38, this.level.theme, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#d4a574",
      })
      .setScrollFactor(0);

    this.player = new Player(this, 120, height - 60);
    this.physics.add.collider(this.player, this.ground);

    this.keys = {
      a: this.input.keyboard.addKey("A"),
      d: this.input.keyboard.addKey("D"),
      left: this.input.keyboard.addKey("LEFT"),
      right: this.input.keyboard.addKey("RIGHT"),
      space: this.input.keyboard.addKey("SPACE"),
      e: this.input.keyboard.addKey("E"),
    };

    this.setupLevel();
    this.showIntroDialogue();
  }

  setupLevel() {
    this.level.npcs?.forEach((npc) => {
      this.add
        .text(npc.x, npc.y, npc.label, { fontSize: "32px" })
        .setOrigin(0.5, 1);
    });

    this.level.interactables?.forEach((config) => {
      const obj = createInteractable(this, config, () => this.handleInteract(config, obj));
      this.interactables.push(obj);
      this.physics.add.overlap(this.player, obj, () => {
        if (!obj.getData("used")) {
          this.player.setNearInteractable(obj);
          obj.getData("hint")?.setVisible(true);
        }
      });
    });

    this.level.collectibles?.forEach((config) => {
      if (config.obstacle) {
        const obs = createCollectible(this, config);
        this.physics.add.overlap(this.player, obs, () => {
          this.cameras.main.shake(100, 0.005);
          obs.destroy();
        });
        return;
      }
      this.totalCollectibles++;
      const item = createCollectible(this, config, () => this.handleCollect(item));
      this.collectibles.push(item);
      this.physics.add.overlap(this.player, item, () => {
        if (!item.getData("collected")) {
          this.handleCollect(item);
        }
      });
    });
  }

  showIntroDialogue() {
    const lines = dialogues[this.level.dialogueKey] || [];
    this.pauseGameplay();
    this.emitDialogue(lines, () => this.resumeGameplay());
  }

  pauseGameplay() {
    this.dialogueActive = true;
    this.player.setVelocity(0, 0);
  }

  resumeGameplay() {
    this.dialogueActive = false;
  }

  emitDialogue(lines, onDone) {
    const onDialogue = this.registry.get("onDialogue");
    if (onDialogue) {
      onDialogue(lines, onDone);
    } else {
      onDone?.();
    }
  }

  handleInteract(config, obj) {
    if (obj.getData("used") || this.dialogueActive || this.levelComplete) return;

    obj.setData("used", true);
    obj.getData("hint")?.destroy();
    this.pauseGameplay();

    const lines = dialogues[config.dialogueKey] || [];
    this.emitDialogue(lines, () => {
      this.resumeGameplay();
      this.completeLevel();
    });
  }

  handleCollect(item) {
    if (item.getData("collected") || this.levelComplete) return;

    item.setData("collected", true);
    item.getData("tween")?.stop();
    item.destroy();
    this.collected++;

    this.registry.get("onSparkle")?.(item.x, item.y);

    if (this.collected >= this.totalCollectibles) {
      const key = this.level.collectDialogueKey;
      if (key) {
        this.pauseGameplay();
        this.emitDialogue(dialogues[key] || [], () => {
          this.resumeGameplay();
          this.completeLevel();
        });
      } else {
        this.completeLevel();
      }
    }
  }

  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;

    const saveProgress = this.registry.get("saveProgress");
    saveProgress?.(this.levelIndex + 1);

    this.time.delayedCall(800, () => {
      playMemoryWave(this, () => {
        if (this.levelIndex < memoryLevels.length - 1) {
          this.scene.start("MemoryLevelScene", { levelIndex: this.levelIndex + 1 });
        } else {
          this.scene.start("FinalScene");
        }
      });
    });
  }

  update() {
    if (this.dialogueActive || this.levelComplete) return;

    const left = this.keys.a.isDown || this.keys.left.isDown;
    const right = this.keys.d.isDown || this.keys.right.isDown;
    const jump = this.keys.space.isDown;
    const interact = Phaser.Input.Keyboard.JustDown(this.keys.e);

    const target = this.player.update({ left, right, jump, interact });

    let nearAny = false;
    this.interactables.forEach((obj) => {
      if (!obj.getData("used")) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          obj.x,
          obj.y
        );
        if (dist < 80) {
          nearAny = true;
          this.player.setNearInteractable(obj);
          obj.getData("hint")?.setVisible(true);
        } else {
          obj.getData("hint")?.setVisible(false);
        }
      }
    });

    if (!nearAny) {
      this.player.setNearInteractable(null);
    }

    if (interact && target && !target.getData("used")) {
      target.getData("onInteract")?.();
    }
  }
}
