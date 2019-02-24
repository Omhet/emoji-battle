const socket = io();
const W = 600;
const H = 600;
let player;
let players = {};
let bullets = [];
const maxSpeed = 3;


socket.on('beat', data => {
    players = data;
});

socket.on('new-bullet', newBullet => {
    const { x, y, dx, dy, color } = newBullet;
    const bullet = new Bullet(x, y, dx, dy, color);
    bullets.push(bullet);
});

function setup() {
    createCanvas(W, H);
    frameRate(30);
    player = new Player(socket.id, random() * width, random() * height);
    const { x, y } = player;
    socket.emit('start', { x, y });
}

function draw() {
    background(100);


    // Players update
    for (const id in players) {
        const { x, y, color } = players[id];
        // if (id !== socket.id) {
        //     if (isCollide(players[id], player)) {
        //     }
        // }
        push();
        fill(color);
        ellipse(x, y, player.d);
        pop();
    }

    // Bullets update
    bullets.forEach(b => {
        b.update();
        b.draw();
    });

    bullets = bullets.filter(b => b.alive);


    // Local player 
    player.move();
    const { x, y } = player;
    socket.emit('update', { x, y });
}




class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.d = 20;
        this.r = this.d / 2;
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

        this.x = constrain(this.x, 0 + this.r, width - this.r);
        this.y = constrain(this.y, 0 + this.r, height - this.r);
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

class Bullet {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.d = 10;
        this.r = this.d / 2;
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
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        push();
        fill(this.color);
        ellipse(this.x, this.y, this.d);
        pop();
    }
}


function mouseClicked() {
    const { x, y } = player;

    let dx = mouseX - x;
    let dy = mouseY - y;

    let len = Math.sqrt(dx * dx, dy * dy);
    dx /= len
    dy /= len

    socket.emit('shoot', { x, y, dx, dy });
}


function isCollide(a, b) {
    return !(
        ((a.y + a.d) < (b.y)) ||
        (a.y > (b.y + b.d)) ||
        ((a.x + a.d) < b.x) ||
        (a.x > (b.x + b.d))
    );
}
