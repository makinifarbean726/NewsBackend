import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/messages/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="spinner"></div>
        <p>Accessing Secure Database...</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <header className="messages-header">
        <div className="title-section">
          <h1>Admin <span>Inbox</span></h1>
          <p>Internal Communications & Reader Feedback</p>
        </div>
        <div className="stats-badge">
          {messages.length} Total Messages
        </div>
      </header>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages found in the archive.</p>
          </div>
        ) : (
          <div className="messages-grid">
            {messages.map((msg) => (
              <div key={msg.id} className="message-card">
                <div className="card-top">
                  <div className="user-info">
                    <span className="avatar">{msg.sender_id.toString().substring(0, 1)}</span>
                    <div className="user-details">
                      <strong>User ID: {msg.sender_id}</strong>
                      <span>Direct Message</span>
                    </div>
                  </div>
                  <div className="message-badge">Internal</div>
                </div>

                <div className="card-body">
                  <p className="message-content">{msg.content}</p>
                </div>

                <div className="card-footer">
                  <span className="timestamp">
                    {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <button className="reply-link">Archive Message</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;