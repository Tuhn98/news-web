import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const VideoCall = ({ pc }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startCall = async () => {
      pc.current = new RTCPeerConnection();

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
        }
      };

      pc.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.getTracks().forEach(track => pc.current.addTrack(track, localStream));
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

    };

    startCall();

    return () => {
      if (pc.current) {
        pc.current.close();
      }
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };
  }, [pc]);

  const endCall = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay playsInline className="local-video" />
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
      </div>
    </div>
  );
};

export default VideoCall;
