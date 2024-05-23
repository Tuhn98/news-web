import React, { useState, useEffect, useRef } from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user] = useAuthState(auth);
  const [isInCall, setIsInCall] = useState(false);
  const navigate = useNavigate();
  const pc = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const callStatus = localStorage.getItem('isInCall');
    if (callStatus) {
      setIsInCall(callStatus === 'true');
    }
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  const startOrEndVideoCall = async () => {
    if (isInCall) {
      localStorage.setItem('isInCall', 'false');
      setIsInCall(false);
      if (pc.current) {
        pc.current.close();
      }
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      navigate('/');
    } else {
      setIsInCall(true);
      localStorage.setItem('isInCall', 'true');

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
      navigate('/video-call');
    }
  };

  return (
    <nav className="nav-bar">
      <h1>React Room Chat</h1>
      {user ? (
        <>
          <button onClick={startOrEndVideoCall} className={isInCall ? "end-call" : "video-call"} type="button">
            {isInCall ? "Kết thúc Video" : "Gọi Video"}
          </button>
          <button onClick={signOut} className="sign-out" type="button">
            Đăng xuất
          </button>
        </>
      ) : ""}
    </nav>
  );
};

export default NavBar;
