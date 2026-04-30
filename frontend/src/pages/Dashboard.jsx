import { useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      // =========================
      // 1. CREATE ARTICLE FIRST
      // =========================
      const articleRes = await api.post(
        "/articles",
        {
          title,
          slug,
          content,
          status: "published",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const articleId = articleRes.data.id;

      console.log("Article created:", articleRes.data);

      // =========================
      // 2. UPLOAD MEDIA (IF ANY)
      // =========================
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("article_id", articleId);
        formData.append("title", file.name);

        const mediaRes = await api.post("/media/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Media uploaded:", mediaRes.data);
      }

      alert("Article created successfully!");
      
      // reset form
      setTitle("");
      setSlug("");
      setContent("");
      setFile(null);

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create article");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleCreate}>
        {/* TITLE */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* CONTENT */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* FILE UPLOAD */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px" }}
        />

        <br />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Article
        </button>
      </form>
    </div>
  );
}

export default Dashboard;