const socket = io();
let player;
let players = [];
const maxSpeed = 3;

class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
    }

    setSpeed(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        push();
        ellipse(this.x, this.y, 20);
        pop();
    }
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

socket.on('beat', playersFromServer => {
    players = playersFromServer;
});

function setup() {
    createCanvas(600, 600);
    frameRate(30);
    player = new Player(socket.id, random() * width, random() * height);
    const { x, y } = player;
    socket.emit('start', { x, y });
}

function draw() {
    background(100);

    for (let id in players) {
        const player = players[id];
        push();
        ellipse(player.x, player.y, 20);
        pop();
    }
    
    player.move();

    const { x, y } = player;
    socket.emit('update', { x, y });
}