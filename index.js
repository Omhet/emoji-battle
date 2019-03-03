const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 3000, listen);

app.use(express.static('public'));

function listen() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

const io = require('socket.io')(server);

// Game
const maxImage = 4;
const W = 1600;
const H = 1600;
const size = 80;
const cols = W / size;
const rows = H / size;
const players = {};

const map = createMap();

setInterval(beat, 25);

function beat() {
  io.sockets.emit('beat', players);
}

io.sockets.on('connection', socket => {
  io.sockets.emit('create-map', map);

  console.log('New client ' + socket.id);

  socket.on('start', data => {
    console.log('start', data);

    let color = getRandomColor();
    let img = getRandomImage();

    for (const id in players) {
      const player = players[id];
      if (color === player.color) {
        color = getRandomColor();
      }
    }

    const player = new Player(data.x, data.y, data.hp, color, img);
    players[socket.id] = player;

    console.log(players);
  });

  socket.on('update', data => {
    const player = players[socket.id];
    if (player) {
      player.x = data.x;
      player.y = data.y;
      player.hp = data.hp;

      if (data.hp <= 0) {
        delete players[socket.id];
      }
    }
  });

  socket.on('shoot', data => {
    if (players[socket.id]) {
      const shot = new Shot(
        data.x,
        data.y,
        data.dx,
        data.dy,
        players[socket.id].color
      );
      io.sockets.emit('new-shot', shot);
    }
  });

  socket.on('got-shot', i => {
    io.sockets.emit('delete-shot', i);
  });

  socket.on('disconnect', () => {
    console.log('Client ' + socket.id + ' disconnected');
    delete players[socket.id];
  });
});

class Player {
  constructor(x, y, hp, color, img) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.d = 20;
    this.color = color;
    this.img = img;
  }
}

class Shot {
  constructor(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }
}

function getRandomColor() {
  return (
    '#' +
    Math.random()
      .toString(16)
      .slice(2, 8)
  );
}

function getRandomImage() {
  return Math.floor(Math.random() * maxImage);
}

function createMap() {
  const map = [];

  for (let x = 0; x < W; x += size) {
    map.push({ x, y: 0, type: 1 });
  }
  for (let x = 0; x < W; x += size) {
    map.push({ x, y: H, type: 1 });
  }
  for (let y = 1; y < H; y += size) {
    map.push({ x: 0, y, type: 1 });
  }
  for (let y = 1; y < H; y += size) {
    map.push({ x: W, y, type: 1 });
  }

  for (let x = 1; x < W - 1; x += size) {
    for (let y = 1; y < H - 1; y += size) {
      const isEmpty = Math.floor(Math.random() * 5);
      const type = Math.floor(Math.random() * 2);
      if (isEmpty === 0 && type !== 0) {
        map.push({ x, y, type });
      }
    }
  }

  return map;
}
