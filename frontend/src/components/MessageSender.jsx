import { useState } from "react";
import api from "../api/axios";
import "./MessageSender.css";

export default function MessageSender() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await api.post("/messages", { content });
      setContent("");
      setIsOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`messenger-wrapper ${isOpen ? "is-open" : ""}`}>
      {isOpen && (
        <div className="messenger-panel">
          <div className="messenger-header">
            <h4>Contact Admin</h4>
            <p>Direct line to NationScope Editorial</p>
          </div>
          
          <textarea
            className="messenger-input"
            placeholder="How can we help you today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          <button 
            className="messenger-send-btn" 
            onClick={sendMessage} 
            disabled={loading || !content.trim()}
          >
            {loading ? <span className="spinner"></span> : "Send Message"}
          </button>
        </div>
      )}

      <button 
        className="messenger-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Message Admin"
      >
        {isOpen ? (
          <span className="close-icon">&times;</span>
        ) : (
          <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}