import { useState } from "react";
import api from "../api/axios";
import "./MessageSender.css";

function MessageSender() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const sendMessage = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const finalContent = `User: ${username || "Guest"}\nEmail: ${email || "Not provided"}\n\nMessage:\n${content}`;
      await api.post("/messages", { content: finalContent });
      setContent("");
      setOpen(false);
      alert("Report sent to NationScope editors.");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="messenger-wrapper">
      {/* INPUT PANEL */}
      {open && (
        <div className="messenger-panel">
          <div className="messenger-header">
            <h4>Editor Inbox</h4>
            <p>{username ? `ID: ${username}` : "Secure Guest Channel"}</p>
          </div>
          
          <textarea
            className="messenger-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on the ground? Share your report..."
            rows={5}
          />

          <button 
            className="messenger-send-btn" 
            onClick={sendMessage} 
            disabled={loading || !content.trim()}
          >
            {loading ? <div className="messenger-spinner" /> : "Transmit Report"}
          </button>
        </div>
      )}

      {/* TOGGLE BUTTON (With Icon) */}
      <button className="messenger-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? (
          <span style={{ fontSize: '24px', fontWeight: '300' }}>✕</span>
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="chat-icon" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ width: '28px', height: '28px' }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}

export default MessageSender;