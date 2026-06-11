import { GAME_CONFIG } from "../../data/gameConfig";

export function drawBackground(scene, level) {
  const { width, height } = GAME_CONFIG;
  const colors = level.bgColors;

  const g = scene.add.graphics();
  g.fillGradientStyle(colors.sky, colors.sky, colors.accent, colors.accent, 1);
  g.fillRect(0, 0, width, height * 0.65);

  g.fillStyle(colors.ground, 1);
  g.fillRect(0, height - 120, width, 120);

  drawDecor(scene, level.decor, colors);
  return g;
}

function drawDecor(scene, decor, colors) {
  const g = scene.add.graphics();

  switch (decor) {
    case "atra":
      g.fillStyle(0x5c4033, 1);
      g.fillRect(80, 280, 200, 140);
      g.fillStyle(0xffd700, 0.6);
      for (let i = 0; i < 5; i++) {
        g.fillCircle(120 + i * 35, 310, 8);
      }
      scene.add
        .text(130, 300, "A Trà", {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#ffe4c4",
        })
        .setAlpha(0.9);
      break;

    case "dalat":
      for (let i = 0; i < 6; i++) {
        g.fillStyle(0x2d4a2d, 1);
        g.fillTriangle(100 + i * 140, 400, 130 + i * 140, 280, 160 + i * 140, 400);
      }
      g.fillStyle(colors.accent, 0.5);
      for (let i = 0; i < 8; i++) {
        g.fillCircle(150 + i * 100, 350 + Math.sin(i) * 20, 6);
      }
      break;

    case "cgv":
      g.fillStyle(0x1a1a2e, 1);
      g.fillRect(200, 200, 400, 200);
      g.fillStyle(0xc41e3a, 1);
      g.fillRect(220, 320, 360, 60);
      scene.add
        .text(340, 240, "CGV", {
          fontFamily: "monospace",
          fontSize: "28px",
          color: "#ff4444",
        })
        .setAlpha(0.9);
      break;

    case "karaoke":
      g.fillStyle(0xff00ff, 0.3);
      g.fillRect(0, 0, GAME_CONFIG.width, 80);
      g.fillStyle(0x00ffff, 0.2);
      g.fillRect(0, GAME_CONFIG.height - 200, GAME_CONFIG.width, 80);
      scene.add
        .text(360, 40, "Rainbow Karaoke", {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ff66ff",
        })
        .setAlpha(0.9);
      break;

    case "saigon":
      g.fillGradientStyle(0xff6b35, 0xff8c42, 0xffd89b, 0xffb347, 1);
      g.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height * 0.5);
      drawSkyline(scene);
      break;

    default:
      break;
  }
}

function drawSkyline(scene) {
  const g = scene.add.graphics();
  g.fillStyle(0x1a1a2e, 0.8);
  const buildings = [
    [600, 180, 60, 200],
    [680, 140, 50, 240],
    [740, 100, 70, 280],
    [820, 160, 55, 220],
    [880, 200, 45, 180],
  ];
  buildings.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));

  g.fillStyle(0x4a90d9, 0.9);
  g.fillRect(755, 60, 40, 220);
  scene.add
    .text(748, 50, "Bitexco", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#aaddff",
    })
    .setAlpha(0.8);
}

export function createGround(scene) {
  const { width, height } = GAME_CONFIG;
  const ground = scene.add.rectangle(width / 2, height - 60, width, 80, 0x3d2b1f);
  scene.physics.add.existing(ground, true);
  return ground;
}

export function createInteractable(scene, config, onInteract) {
  const bg = scene.add.circle(config.x, config.y, 28, config.color || 0xffd700, 0.85);
  scene.add
    .text(config.x, config.y, config.label, { fontSize: "24px" })
    .setOrigin(0.5);

  scene.physics.add.existing(bg);
  bg.body.setCircle(28);
  bg.body.setAllowGravity(false);
  bg.body.setImmovable(true);
  bg.setData("config", config);
  bg.setData("onInteract", onInteract);
  bg.setData("used", false);

  const hint = scene.add
    .text(config.x, config.y - 50, config.hint || "Bấm E", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#ffe4b5",
      backgroundColor: "#00000088",
      padding: { x: 6, y: 4 },
    })
    .setOrigin(0.5)
    .setVisible(false);

  bg.setData("hint", hint);
  return bg;
}

export function createCollectible(scene, config, onCollect) {
  const sprite = scene.add
    .text(config.x, config.y, config.label, { fontSize: "28px" })
    .setOrigin(0.5);

  if (config.obstacle) {
    scene.physics.add.existing(sprite);
    sprite.body.setSize(40, 40);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocityX(-80);
    sprite.setData("obstacle", true);
    return sprite;
  }

  scene.physics.add.existing(sprite);
  sprite.body.setSize(40, 40);
  sprite.body.setAllowGravity(false);
  sprite.setData("config", config);
  sprite.setData("collected", false);
  sprite.setData("onCollect", onCollect);

  const tween = scene.tweens.add({
    targets: sprite,
    y: config.y - 8,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  sprite.setData("tween", tween);
  return sprite;
}
