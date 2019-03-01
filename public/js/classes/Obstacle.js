class Obstacle {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.d = 80;
    this.r = this.d / 2;
    this.sprite = createSprite(
      this.x + this.r,
      this.y + this.r,
      this.d,
      this.d
    );
    this.sprite.shapeColor = 'white';
  }

  draw() {
    push();
    // rect(this.x, this.y, this.d, this.d);
    this.x = this.sprite.position.x - this.r;
    this.y = this.sprite.position.y - this.r;

    drawSprite(this.sprite);
    pop();
  }
}
