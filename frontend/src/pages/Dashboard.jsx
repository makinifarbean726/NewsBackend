import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [file, setFile] = useState(null);
  const [existingArticleId, setExistingArticleId] = useState("");

  // =========================
  // NEW: categories state
  // =========================
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required");
      return;
    }

    try {
      let articleId = existingArticleId;

      // =========================
      // CREATE ARTICLE
      // =========================
      if (!existingArticleId) {
        const articleRes = await api.post(
          "/articles",
          {
            title,
            slug,
            content,
            category_id: categoryId || null, // ✅ NEW
            status: "published",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        articleId = articleRes.data.article_id;

        console.log("Article created:", articleRes.data);
      }

      // =========================
      // UPLOAD MEDIA
      // =========================
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("article_id", articleId);
        formData.append("title", file.name);

        const mediaRes = await api.post("/media/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Media uploaded:", mediaRes.data);
      }

      alert("Success!");

      // reset
      setTitle("");
      setSlug("");
      setContent("");
      setFile(null);
      setExistingArticleId("");
      setCategoryId("");

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleCreate}>
        <h3>Create New Article</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br /><br />

        {/* =========================
            CATEGORY SELECT DROPDOWN
        ========================= */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <br /><br />

        <h3>OR Attach Media to Existing Article</h3>

        <input
          placeholder="Existing Article ID (optional)"
          value={existingArticleId}
          onChange={(e) => setExistingArticleId(e.target.value)}
        />
        <br /><br />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Dashboard;