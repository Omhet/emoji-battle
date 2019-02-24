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

class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.d = 20;
        this.color = color;
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

const players = {};

setInterval(beat, 33);


function beat() {
    io.sockets.emit('beat', players);
}


io.sockets.on('connection', socket => {
    console.log('New client ' + socket.id);

    socket.on('start', data => {
        console.log('start', data);

        let color = getRandomColor();

        for (const id in players) {
            const player = players[id];
            if (color === player.color) {
                color = getRandomColor();
            }
        }

        const player = new Player(data.x, data.y, color);
        players[socket.id] = player;


        console.log(players);
    });

    socket.on('update', data => {
        const player = players[socket.id];
        if (player) {
            player.x = data.x;
            player.y = data.y;
        }
    });

    socket.on('shoot', data => {
        const shot = new Shot(data.x, data.y, data.dx, data.dy, players[socket.id].color);
        io.sockets.emit('new-shot', shot);
    });

    socket.on('disconnect', () => {
        console.log('Client ' + socket.id + ' disconnected');
        delete players[socket.id];
    });
});


function getRandomColor() {
    return "#" + Math.random().toString(16).slice(2, 8);
} 