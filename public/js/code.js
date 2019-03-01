const socket = io();
const W = 800;
const H = 800;
const size = 80;
const cols = W / size;
const rows = H / size;
let map = [];
let mapGroup;
let player;
let players = {};
const playerImages = [];
let shots = [];
const maxSpeed = 4;
const maxImage = 4;

// SOCKETS
socket.on('beat', data => {
  players = data;
});

socket.on('create-map', newMap => {
  console.log(newMap);
  newMap.forEach(({ x, y, type }) => {
    const obs = new Obstacle(type, x, y);
    map.push(obs);
  });
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

  mapGroup = new Group();

  map.forEach(obs => {
    mapGroup.add(obs.sprite);
  });

  player = new Player(socket.id, random() * width, random() * height);
  const { x, y, hp } = player;
  socket.emit('start', { x, y, hp });
}

// UPDATE
function draw() {
  background(100);

  camera.position.x = player.x;
  camera.position.y = player.y;

  // Map
  map.forEach(obs => {
    obs.draw();
  });

  // mapGroup.displace(mapGroup);
  player.sprite.collide(mapGroup);

  // Bullets update
  shots.forEach(s => {
    s.update();
    s.draw();
  });

  shots = shots.filter(s => s.alive);

  // Players update
  for (const id in players) {
    const { x, y, img } = players[id];
    // if (id !== socket.id) {
    push();
    image(playerImages[img], x, y);
    pop();
    // }
  }

  // Local player
  shots.forEach((s, i) => {
    map.forEach(obs => {
      if (overlap(obs, s)) {
        console.log('bam');
        s.alive = false;
        socket.emit('got-shot', i);
      }
    });

    if (overlap(s, player) && s.color !== players[socket.id].color && s.alive) {
      console.log('boom');
      socket.emit('got-shot', i);
      player.hp--;
    }
  });

  drawSprite(player.sprite);

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
  const { x, y } = camera.position;
  let dx = camera.mouseX - x;
  let dy = camera.mouseY - y;

  const vel = createVector(dx, dy);
  vel.normalize();

  socket.emit('shoot', { x, y, dx: vel.x, dy: vel.y });
}
