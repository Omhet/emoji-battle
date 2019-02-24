const socket = io();
const W = 600;
const H = 600;
let player;
let players = {};
let bullets = [];
const maxSpeed = 3;



// SOCKETS
socket.on('beat', data => {
    players = data;
});

socket.on('new-bullet', newBullet => {
    const { x, y, dx, dy, color } = newBullet;
    const bullet = new Bullet(x, y, dx, dy, color);
    bullets.push(bullet);
});



// SETUP
function setup() {
    createCanvas(W, H);
    frameRate(30);
    player = new Player(socket.id, random() * width, random() * height);
    const { x, y } = player;
    socket.emit('start', { x, y });
}



// UPDATE
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

    let len = Math.sqrt(dx * dx, dy * dy);
    dx /= len
    dy /= len

    socket.emit('shoot', { x, y, dx, dy });
}
