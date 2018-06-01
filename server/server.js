const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

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

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chit-chat'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined'));

    socket.on('createMessage', (message, callback) => {        
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('generateLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.logitude));
    });

    socket.on('disconnect', () => {
        console.log('user is disconnect');
    });
});