import express from "express";
import { Server } from "socket.io";
import "dotenv";
import bodyParser from "body-parser";

const io = new Server(8081, {
  cors: true,
});

const app = express();

app.use(bodyParser.json());

const socketToEmailMapping = new Map();
const emailToSocketMapping = new Map();
io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("user", emailId, "joined Room", roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId, id: socket.id });
    socket.broadcast.to(roomId).emit("user-joined", { emailId, id: socket.id });
  });

  socket.on("call-user", (data) => {
    const { to, offer } = data;
    console.log("calling user", to);

    socket.to(to).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", (data) => {
    const { to, ans } = data;

    console.log("got call accepted", ans);
    socket.to(to).emit("call-accepted", { from: socket.id, ans });
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server is running on", port);
});
