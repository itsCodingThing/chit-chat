const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/valid');
const {Users} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 1729;
let users = new Users();

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

io.on('connection', (socket) => {

    
    socket.on('join', (param, callback) => {
        if (!param.name || !param.room) {
           return callback('name and room name is required.');
        }
        
        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, param.name, param.room);
        
        io.to(param.room).emit('updateUserList', users.getUserList(param.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chit-chat'));    
        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin', `${param.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {        
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('generateLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.logitude));
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

    });
});