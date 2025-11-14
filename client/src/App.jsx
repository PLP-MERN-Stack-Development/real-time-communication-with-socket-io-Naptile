import { useState, useEffect, useRef } from "react";
import { useSocket } from "./socket/socket";
import "./App.css";

function App() {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    sendMessage,
    sendPrivateMessage,
    sendFile,
    setTyping,
    lastMessage,
  } = useSocket();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadedMessages, setLoadedMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const MESSAGES_PER_PAGE = 20;

  // Request notification permission
  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  // Load initial messages
  const loadMessages = async (reset = false) => {
    const res = await fetch(`/api/messages?skip=${reset ? 0 : skip}&limit=${MESSAGES_PER_PAGE}`);
    const data = await res.json();
    setLoadedMessages((prev) => reset ? data : [...data, ...prev]);
    if (!reset) setSkip(skip + MESSAGES_PER_PAGE);
  };

  useEffect(() => {
    if (joined) loadMessages(true);
  }, [joined]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loadedMessages, messages]);

  // Browser notification for lastMessage
  useEffect(() => {
    if (!lastMessage || lastMessage.system) return;
    if (Notification.permission === "granted") {
      new Notification(`New message from ${lastMessage.sender}`, {
        body: lastMessage.message || lastMessage.fileName,
      });
    }
  }, [lastMessage]);

  const handleJoin = () => {
    if (!username) return alert("Enter a username");
    connect(username);
    setJoined(true);
    requestNotificationPermission();
  };

  const handleSendMessage = () => {
    if (!message) return;
    if (selectedUser) {
      sendPrivateMessage(selectedUser.id, message);
    } else {
      sendMessage(message);
    }
    setMessage("");
    setTyping(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  // Load older messages on scroll to top
  const handleScroll = () => {
    if (chatBoxRef.current.scrollTop === 0) {
      loadMessages();
    }
  };

  return (
    <div className="container">
      {!joined ? (
        <div className="join-container">
          <h2>Enter Username to Join Chat</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="chat-input"
          />
          <button className="send-button" onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <div className="chat-container">
          <h2 className="chat-title">
            {selectedUser ? `Private Chat with ${selectedUser.username}` : "Global Chat Room"}
          </h2>
          <p className="status">Status: {isConnected ? "Connected" : "Disconnected"}</p>

          {/* Chat Messages */}
          <div className="chat-box" onScroll={handleScroll} ref={chatBoxRef}>
            {loadedMessages.map((msg) => (
              <p key={msg.id} className={msg.isPrivate ? "private-message" : ""}>
                {msg.system ? (
                  <em>{msg.message}</em>
                ) : msg.isFile ? (
                  <>
                    <strong>{msg.sender}</strong> {msg.isPrivate && "(Private)"}: 
                    <a href={msg.fileData} download={msg.fileName} target="_blank" rel="noopener noreferrer">
                      {msg.fileName}
                    </a>
                    {msg.readBy?.length > 0 && (
                      <span className="read-receipt"> ✔{msg.readBy.length}</span>
                    )}
                  </>
                ) : (
                  <>
                    <strong>{msg.sender}</strong> {msg.isPrivate && "(Private)"}: {msg.message}
                    {msg.readBy?.length > 0 && (
                      <span className="read-receipt"> ✔{msg.readBy.length}</span>
                    )}
                  </>
                )}
              </p>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input & File Upload */}
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type a message"
              className="chat-input"
            />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files.length > 0) sendFile(selectedUser?.id, e.target.files[0]);
              }}
              className="file-input"
            />
            <button className="send-button" onClick={handleSendMessage}>Send</button>
          </div>

          {/* Typing indicator */}
          {Object.values(typingUsers).length > 0 && (
            <p className="typing-indicator">
              {Object.entries(typingUsers)
                .filter(([id]) => !selectedUser || id === selectedUser.id)
                .map(([_, name]) => name)
                .join(", ")} typing...
            </p>
          )}

          {/* Online Users */}
          <div className="users-container">
            <h4>Online Users:</h4>
            <ul className="user-list">
              {users.filter((u) => u.username !== username).map((u) => (
                <li
                  key={u.id}
                  className={selectedUser?.id === u.id ? "selected-user" : ""}
                  onClick={() => setSelectedUser(u)}
                >
                  {u.username} {selectedUser?.id === u.id && "(Chatting)"}
                </li>
              ))}
            </ul>
            {selectedUser && (
              <button className="send-button" onClick={() => setSelectedUser(null)}>
                Back to Global Chat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
