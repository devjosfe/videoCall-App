import React, { useCallback, useEffect, useMemo, useState } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => {
  return React.useContext(PeerContext);
};

export const PeerProvider = (props) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(new RTCSessionDescription(ans));
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();

    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
