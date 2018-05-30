const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 1729;

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

io.on('connection', (socket) => {
    console.log('user is connected');

    socket.on('disconnect', () => {
        console.log('user is disconnect');
    });

    socket.on('createMessage', (message) => {
        console.log(`createdMessage: ${message.from},${message.text}`);
        io.emit('newMessage', {
            form: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });      
    })
});