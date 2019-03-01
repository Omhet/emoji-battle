class Player {
  constructor(id, x, y) {
    this.id = id;
    this.hp = 1;
    this.x = x;
    this.y = y;
    this.d = 64;
    this.r = this.d / 2;
    this.dx = 0;
    this.dy = 0;
    // this.sprite = createSprite(this.x, this.y, this.d * 4, this.d * 4);
  }

  setSpeed(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    this.x = constrain(this.x, 0 + this.r, width - this.r);
    this.y = constrain(this.y, 0 + this.r, height - this.r);

    // this.sprite.position.x = this.x;
    // this.sprite.position.y = this.y;
  }
}
