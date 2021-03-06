const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { Users } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 1729;
let users = new Users();

io.on("connection", (socket) => {
  console.log("connected to front-end");
  socket.on("join", (param, callback) => {
    if (!param.name || !param.room) {
      return callback("name and room name is required.");
    }

    socket.join(param.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, param.name, param.room);

    io.to(param.room).emit("updateUserList", users.getUserList(param.room));
    socket.emit("newMessage", generateMessage("Admin", "Welcome to chit-chat"));
    socket.broadcast
      .to(param.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${param.name} has joined.`)
      );
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    let user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
    callback();
  });

  socket.on("createLocationMessage", (coords) => {
    let user = users.getUser(socket.id);
    io.to(user.room).emit(
      "generateLocationMessage",
      generateLocationMessage(user.name, coords.latitude, coords.logitude)
    );
  });

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);

    io.to(user.room).emit("updateUserList", users.getUserList(user.room));
    io.to(user.room).emit(
      "newMessage",
      generateMessage("Admin", `${user.name} has left.`)
    );
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
