import React, { useState, useEffect, useCallback, use } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate();
  const [emailId, setemailId] = useState("");
  const [roomId, setRoomId] = useState("");
  const { socket } = useSocket();
  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      console.log("joined room", roomId);
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);

    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);
  const handleJoinRoom = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("join-room", { emailId, roomId });
    },
    [emailId, roomId, socket]
  );

  return (
    <div>
      <input
        type="email"
        placeholder="enter the email"
        onChange={(e) => setemailId(e.target.value)}
        value={emailId}
      />
      <input
        type="text"
        placeholder="enter the roomId"
        onChange={(e) => setRoomId(e.target.value)}
        value={roomId}
      />
      <button onClick={handleJoinRoom}>Enter</button>
    </div>
  );
};

export default Homepage;
