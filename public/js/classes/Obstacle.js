class Obstacle {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.d = 40;
    // this.sprite = createSprite(this.x, this.y, this.d, this.d);
  }

  draw() {
    push();
    rect(this.x, this.y, this.d, this.d);
    // drawSprite(this.sprite);
    pop();
  }
}
