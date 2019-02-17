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
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
        const player = new Player(data.x, data.y);
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
});
