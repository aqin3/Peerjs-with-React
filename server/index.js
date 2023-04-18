const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomHandler = require("./roomHandler");
const { join } = require("path");

dotenv.config();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];

io.on("connection", (socket) => {
//   console.log("connected", socket.id);
  roomHandler(io, socket, rooms);

  socket.on('id', data => {
    console.log(data);
    io.to(data.to).emit('id', { from: data.from, id: data.id })
  })

//   socket.on("disconnect", () => {
//     console.log("disconnected", socket.id);
//   });

//   socket.on('callUser', data => {
//     console.log('calling', data.to, 'from', data.from);
//     io.to(data.to).emit('hey', {signal: data.signal, from: data.from})
//   })

//   socket.on('acceptCall', data => {
//     console.log('accepting ', data.to);
//     io.to(data.to).emit('callAccepted', data.signal)
//   })

//   socket.on('askId', data => {
//     console.log('askId', data);
//     io.to(data.to).emit('askId', { from: data.from, id: data.id })
//   })

//   socket.on('answerId', data => {
//     console.log('answerId', data);
//     io.to(data.to).emit('answerId', data.id)
//   })
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
