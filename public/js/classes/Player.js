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
    this.sprite = createSprite(this.x, this.y, this.d, this.d);
    this.sprite.shapeColor = 'rgba(0, 0, 0 ,0)';
  }

  setSpeed(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  move() {
    // this.x += this.dx;
    // this.y += this.dy;

    // this.x = constrain(this.x, 0 + this.r, 1600 - this.r);
    // this.y = constrain(this.y, 0 + this.r, 1600 - this.r);

    // this.sprite.position.x = this.x;
    // this.sprite.position.y = this.y;

    this.sprite.position.x += this.dx;
    this.sprite.position.y += this.dy;

    this.sprite.position.x = constrain(
      this.sprite.position.x,
      0 + this.r,
      1600 - this.r
    );
    this.sprite.position.y = constrain(
      this.sprite.position.y,
      0 + this.r,
      1600 - this.r
    );

    this.x = this.sprite.position.x;
    this.y = this.sprite.position.y;
  }
}
