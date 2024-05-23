import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import VideoCall from './components/VideoCall';

function App() {
  const [user] = useAuthState(auth);
  const pc = useRef(null);

  return (
    <Router>
      <NavBar />
      <div className="App">
        {!user ? (
          <Welcome />
        ) : (
          <Routes>
          <Route path="/" element={!user ? <Welcome /> : <ChatBox />} />
          <Route path="/video-call" element={<VideoCall pc={pc} />} />
        </Routes>
        )}
      </div>
    </Router>
  );
}

const EndCall = () => {
  useEffect(() => {
    localStorage.setItem('isInCall', 'false');
    window.close();
  }, []);

  return null;
}

export default App;
