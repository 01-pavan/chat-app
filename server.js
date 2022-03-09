const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const botName = "chat-bot";

//setting static folder
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    console.log(user.room);
    //welcome current user
    socket.emit("message", formatMessage(botName, "welcome to chat-app"));

    //broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} as joined the chat`)
      );
    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen to the client msg from chat form
  socket.on("chatMsg", (msg) => {
    const user = getCurrentUser(socket.id);
    // console.log(user.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  //runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, ` ${user.username} has left the chat`)
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000; //IF THERE IS ANY ENV VARIABLE USE THAT ELSE USE 3000

server.listen(PORT, () => {
  console.log(`server running on the port ${PORT}`);
});
