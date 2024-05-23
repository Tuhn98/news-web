import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ReactMic } from 'react-mic';

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Vui lòng nhập tin nhắn...");
      return;
    }

    const { uid, displayName, photoURL, email } = auth.currentUser;

    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      email: email, // Lưu email của người gửi
      createdAt: serverTimestamp(),
      uid,
      fileURL: null,
      fileName: null,
      fileType: null,
    });

    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { uid, displayName, photoURL, email } = auth.currentUser;

    const fileRef = ref(storage, `files/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    const fileName = file.name;
    const fileType = file.type.startsWith("image/") ? "image" : "file";

    await addDoc(collection(db, "messages"), {
      text: "",
      name: displayName,
      avatar: photoURL,
      email: email,
      createdAt: serverTimestamp(),
      uid,
      fileURL: fileURL,
      fileName: fileName,
      fileType: fileType,
    });

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartRecording = () => {
    setRecording(true);
  };

  const handleStopRecording = () => {
    setRecording(false);
  };

  const onStop = async (recordedBlob) => {
    const { uid, displayName, photoURL, email } = auth.currentUser;
    const fileRef = ref(storage, `voiceMessages/${Date.now()}.mp3`);
    await uploadBytes(fileRef, recordedBlob.blob);
    const fileURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "messages"), {
      text: "",
      name: displayName,
      avatar: photoURL,
      email: email,
      createdAt: serverTimestamp(),
      uid,
      fileURL: fileURL,
      fileName: `Voice Message`,
      fileType: "audio",
    });

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="send-message-container">
      <div className="send-message">
        <label htmlFor="messageInput" hidden>
          Nhập...
        </label>
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className="form-input__input"
          placeholder="Nhập..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} type="submit">Gửi</button>
        <button style={{ marginLeft: 5, borderRadius: 5 }} onClick={() => document.getElementById('fileInput').click()}>
          Gửi File
        </button>
        <button style={{ display: recording ? "none" : "unset", marginLeft: 5, borderRadius: 5, width: 80 }} onClick={handleStartRecording} disabled={recording}>Bắt đầu ghi âm</button>
        <button style={{ display: !recording ? "none" : "unset", marginLeft: 5, borderRadius: 5, width: 80 }} onClick={handleStopRecording} disabled={!recording}>Dừng ghi âm</button>
      </div>
      <div>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <div>
        <ReactMic
          record={recording}
          className="sound-wave"
          onStop={onStop}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        />
      </div>
    </div>
  );
};

export default SendMessage;
