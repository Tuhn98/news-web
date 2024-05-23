import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import Modal from 'react-modal';

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(message.text);
  const [likes, setLikes] = useState(message.likes || 0);
  const [dislikes, setDislikes] = useState(message.dislikes || 0);

  const handleFileClick = () => {
    if (message.fileURL && message.fileType !== "audio") {
      window.open(message.fileURL, "_blank");
    }
  };

  const handleDelete = async () => {
    const messageRef = doc(db, "messages", message.id);
    await deleteDoc(messageRef);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEdit = async () => {
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      text: newMessage
    });
    closeEditModal();
  };

  const handleLike = async () => {
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      likes: increment(1)
    });
    setLikes(likes + 1);
  };

  const handleDislike = async () => {
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      dislikes: increment(1)
    });
    setDislikes(dislikes + 1);
  };

  return (
    <div className={`chat-bubble ${message.uid === user?.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
        onClick={openModal}
        style={{ cursor: 'pointer' }}
      />
      <div
        className="chat-bubble__right"
        onClick={handleFileClick}
        style={{ cursor: message.fileURL ? "pointer" : "default" }}
      >
        <p className="user-name">{message.name}</p>
        {message.fileType === "image" ? (
          <img
            src={message.fileURL}
            alt={message.fileName}
            className="user-image"
          />
        ) : message.fileType === "audio" ? (
          <audio controls>
            <source src={message.fileURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : message.fileURL ? (
          <p className="user-message">
            File: <a href={message.fileURL} download>{message.fileName}</a>
          </p>
        ) : (
          <p className="user-message">{message.text}</p>
        )}
        <div className="reaction-buttons">
          <button onClick={handleLike}>👍 {likes}</button>
          <button onClick={handleDislike}>👎 {dislikes}</button>
        </div>
      </div>
      {message.uid === user?.uid && !message.fileURL ? (
        <div>
          <button onClick={handleDelete} className="delete-button">
            Xóa
          </button>
          <button onClick={openEditModal} className="edit-button">
            Sửa
          </button>
        </div>
      ) : message.uid === user?.uid ? <button onClick={handleDelete} className="delete-button">
        Xóa
      </button> : ""}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="User Information"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <img src={message.avatar} alt="user avatar" className="modal-avatar" />
          <p className="modal-name">Name: {message.name}</p>
          <p className="modal-email">Email: {message.email}</p>
          <button onClick={closeModal} className="close-button">Close</button>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Message"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="edit-textarea"
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button onClick={handleEdit} className="save-button">Lưu</button>
            <button onClick={closeEditModal} className="close-button">Đóng</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Message;
