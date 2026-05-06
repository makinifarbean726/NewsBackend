import { useEffect, useState } from "react";
import api from "../api/axios";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // ROLE FROM LOCAL STORAGE
  // =========================
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // =========================
  // FETCH ALL MESSAGES
  // =========================
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

  // =========================
  // DELETE MESSAGE
  // =========================
  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await api.delete(`/messages/${id}`);

      // remove instantly from UI
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
      alert("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PROTECT PAGE
  // =========================
  if (!isAdmin) {
    return <p>Access denied</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📩 Admin Messages</h2>

      {messages.length === 0 && <p>No messages yet</p>}

      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <p style={{ whiteSpace: "pre-line" }}>
            {m.content}
          </p>

          <small>
            {new Date(m.created_at).toLocaleString()}
          </small>

          <br />

          <button
            onClick={() => deleteMessage(m.id)}
            disabled={loading}
            style={{
              marginTop: 10,
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Messages;