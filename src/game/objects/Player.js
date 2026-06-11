import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "hoang-run", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.45);
    this.setOrigin(0.5, 1);
    this.setCollideWorldBounds(true);
    this.body.setSize(100, 180);
    this.body.setOffset(78, 60);

    this.speed = 220;
    this.jumpVelocity = -420;
    this.facingRight = true;
    this.canInteract = false;
    this.nearInteractable = null;
  }

  update(input) {
    const { left, right, jump, interact } = input;

    if (left) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
      this.facingRight = false;
      if (this.body.blocked.down || this.body.touching.down) {
        this.play("hoang-run", true);
      }
    } else if (right) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
      this.facingRight = true;
      if (this.body.blocked.down || this.body.touching.down) {
        this.play("hoang-run", true);
      }
    } else {
      this.setVelocityX(0);
      if (this.body.blocked.down || this.body.touching.down) {
        this.anims.stop();
        this.setFrame(0);
      }
    }

    if (
      jump &&
      Phaser.Input.Keyboard.JustDown(this.scene.keys.space) &&
      (this.body.blocked.down || this.body.touching.down)
    ) {
      this.setVelocityY(this.jumpVelocity);
      this.anims.stop();
      this.setFrame(2);
    }

    if (interact && this.nearInteractable) {
      return this.nearInteractable;
    }

    return null;
  }

  setNearInteractable(obj) {
    this.nearInteractable = obj;
    this.canInteract = !!obj;
  }
}
