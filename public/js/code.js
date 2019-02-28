const socket = io();
const W = 600;
const H = 600;
let player;
let players = {};
const playerImages = [];
let shots = [];
const maxSpeed = 3;
const maxImage = 4;

// SOCKETS
socket.on('beat', data => {
  players = data;
});

socket.on('new-shot', newShot => {
  const { x, y, dx, dy, color } = newShot;
  const shot = new Shot(x, y, dx, dy, color);
  shots.push(shot);
});

socket.on('delete-shot', i => {
  if (shots[i] && shots[i].alive) {
    shots[i].alive = false;
  }
});

// PRELOAD
function preload() {
  for (let i = 0; i < maxImage; i++) {
    playerImages.push(loadImage(`img/player/${i}.png`));
  }
}

// SETUP
function setup() {
  createCanvas(W, H);
  frameRate(30);
  imageMode(CENTER);

  player = new Player(socket.id, random() * width, random() * height);
  const { x, y, hp } = player;
  socket.emit('start', { x, y, hp });
}

// UPDATE
function draw() {
  background(100);

  // Bullets update
  shots.forEach(s => {
    s.update();
    s.draw();
  });

  shots = shots.filter(s => s.alive);

  // Players update
  for (const id in players) {
    const { x, y, color, img } = players[id];
    push();
    // fill(color);
    // ellipse(x, y, player.d);

    image(playerImages[img], x, y);
    pop();
  }

  // Local player
  shots.forEach((s, i) => {
    if (
      isCollide(s, player) &&
      s.color !== players[socket.id].color &&
      s.alive
    ) {
      console.log('boom');
      socket.emit('got-shot', i);
      player.hp--;
    }
  });

  player.move();
  const { x, y, hp } = player;
  socket.emit('update', { x, y, hp });
}

function keyPressed() {
  switch (key) {
    case 'W': {
      player.setSpeed(player.dx, -maxSpeed);
      break;
    }
    case 'S': {
      player.setSpeed(player.dx, maxSpeed);
      break;
    }
    case 'A': {
      player.setSpeed(-maxSpeed, player.dy);
      break;
    }
    case 'D': {
      player.setSpeed(maxSpeed, player.dy);
      break;
    }
  }
}

function keyReleased() {
  switch (key) {
    case 'W':
    case 'S': {
      player.setSpeed(player.dx, 0);
      break;
    }
    case 'A':
    case 'D': {
      player.setSpeed(0, player.dy);
      break;
    }
  }
}

function mouseClicked() {
  const { x, y } = player;
  let dx = mouseX - x;
  let dy = mouseY - y;

  const vel = createVector(dx, dy);
  vel.normalize();

  socket.emit('shoot', { x, y, dx: vel.x, dy: vel.y });
}
