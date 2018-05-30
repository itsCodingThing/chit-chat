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