class Shot {
  constructor(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.d = 10;
    this.r = this.d / 2;
    this.speed = 10;
    this.color = color;
    this.alive = true;
  }

  update() {
    this.move();

    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.alive = false;
    }
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  draw() {
    push();
    fill(this.color);
    ellipse(this.x, this.y, this.d);
    pop();
  }
}
