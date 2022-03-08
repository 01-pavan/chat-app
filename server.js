const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const formatMessage = require("./utils/messages");
const botName = "chat-bot";

//setting static folder
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on("connection", (socket) => {
  //welcome current user
  socket.emit("message", formatMessage(botName, "welcome to chat-app"));

  //broadcast when user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "a user as joined the chat")
  );

  //runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "user has left the chat"));
  });

  //listen to the client msg from chat form
  socket.on("chatMsg", (msg) => {
    // console.log(msg);
    io.emit("message", formatMessage("user", msg));
  });
});

const PORT = 3000; //IF THERE IS ANY ENV VARIABLE USE THAT ELSE USE 3000

server.listen(PORT, () => {
  console.log(`server running on the port ${PORT}`);
});
