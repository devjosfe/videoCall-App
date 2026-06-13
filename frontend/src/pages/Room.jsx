import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import ReactPlayer from "react-player";
export default function Room() {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream } =
    usePeer();
  const [myStream, SetMyStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleJoinNewUser = useCallback(
    async ({ emailId, id }) => {
      console.log(" with id", id);
      setRemoteSocketId(id);

      console.log("new user joined", emailId, " with socketId", remoteSocketId);
    },
    [setRemoteSocketId]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("incoming call from", from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      SetMyStream(stream);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { to: from, ans });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { from, ans } = data;

      console.log("call got accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );
  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    SetMyStream(stream);
  }, [sendStream]);
  const handleTrackEvent = useCallback((e) => {
    const streams = e.streams;
    setRemoteStream(streams[0]);
  }, []);
  const handleCallButton = useCallback(
    async (data) => {
      await getUserMediaStream();
      const offer = await createOffer();
      console.log("calling user in frontend", remoteSocketId);
      socket.emit("call-user", { to: remoteSocketId, offer });
      // peer.addEventListener("track", handleTrackEvent);

      // return () => {
      //   peer.removeEventListener("track", handleTrackEvent);
      // };
    },
    [peer, createOffer, remoteSocketId]
  );
  useEffect(() => {
    socket.on("user-joined", handleJoinNewUser);
    socket.on("incoming-call", handleIncomingCall);

    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleJoinNewUser);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleCallAccepted, handleIncomingCall, handleJoinNewUser]);

  return (
    <div>
      <h1> room </h1>
      {remoteSocketId ? (
        <h1>connected</h1>
      ) : (
        <h1>other person is not present</h1>
      )}
      {remoteSocketId ? <button onClick={handleCallButton}>call</button> : ""}
      <ReactPlayer url={myStream} playing muted />
      {/* <ReactPlayer url={remoteStream} playing /> */}
    </div>
  );
}
