const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("messageSend", ({ name, message }) => {
    // in here, put backend process to store message in DB
    io.emit("messageReply", { name, message, dateTime: new Date() });
  });
  socket.on("comment", ({ name, comment }) => {
    console.log("someone posted a comment");
    io.emit("comment", { name, comment });
  });
});

server.listen(4000, function () {
  console.log("listening on port 4000");
});
