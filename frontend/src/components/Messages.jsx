import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Messages.css"; // Import the CSS file

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages/admin/all");
      setMessages(res.data || []);
    } catch (err) {
      console.error("FETCH MESSAGES ERROR:", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchMessages();
  }, [isAdmin]);

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
      alert("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <p>🚫 Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <header className="messages-header">
        <h2>📩 Admin Messages</h2>
        <span className="message-count">{messages.length} Total</span>
      </header>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages yet. Check back later!</p>
        </div>
      ) : (
        <div className="messages-grid">
          {messages.map((m) => (
            <div key={m.id} className="message-card">
              <div className="message-body">
                <p className="message-content">{m.content}</p>
              </div>
              
              <div className="message-footer">
                <span className="timestamp">
                  {new Date(m.created_at).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
                
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(m.id)}
                  disabled={loading}
                >
                  {loading ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;