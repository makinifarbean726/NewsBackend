import { useEffect, useState } from "react";
import api from "../api/axios";
import "./EditArticle.css";
import "./Dashboard.css"

function Dashboard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  
  // Logic for the Related Search Bar
  const [relatedQuery, setRelatedQuery] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRelated, setSelectedRelated] = useState([]);
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await api.get("/categories");
        const artRes = await api.get("/articles");
        setCategories(catRes.data);
        setArticles(artRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // Filter logic: Search through articles in real-time
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(relatedQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const articleRes = await api.post(
        "/articles",
        {
          title,
          content,
          category_ids: selectedCategories,
          related_ids: selectedRelated,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const articleId = articleRes.data.article_id;

      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("article_id", articleId);
        formData.append("title", file.name);

        await api.post("/media/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Article created successfully!");
      setTitle("");
      setContent("");
      setFiles([]);
      setSelectedCategories([]);
      setSelectedRelated([]);
      setRelatedQuery("");
    } catch (err) {
      console.error(err);
      alert("Failed to create article");
    }
  };

  return (
    <div className="edit-article-container">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Draft and Publish New Stories</p>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Article Headline</h3>
          <input
            placeholder="Enter catchy headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="main-title-input"
          />

          <h3>Content</h3>
          <textarea
            placeholder="Type your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        <div className="form-section">
          <h3>Attachments (Images/Videos)</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input-styled"
          />
        </div>

        <div className="taxonomy-grid">
          {/* CATEGORIES COLUMN */}
          <div className="taxonomy-column">
            <h3>Categories</h3>
            <div className="checkbox-group">
              {categories.map((c) => (
                <label key={c.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c.id)}
                    onChange={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                      );
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* SEARCH & ATTACH COLUMN */}
          <div className="taxonomy-column">
            <h3>Link Related Content</h3>
            
            <div className="related-search-wrapper">
              <div className="search-input-wrapper miniature">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search existing news..."
                  value={relatedQuery}
                  onChange={(e) => setRelatedQuery(e.target.value)}
                  className="ns-search-input"
                />
              </div>
            </div>

            <div className="checkbox-group">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((a) => (
                  <label key={a.id} className={selectedRelated.includes(a.id) ? "selected-item" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedRelated.includes(a.id)}
                      onChange={() => {
                        setSelectedRelated((prev) =>
                          prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                        );
                      }}
                    />
                    {a.title}
                  </label>
                ))
              ) : (
                <p className="no-results">No articles match your search</p>
              )}
            </div>
            {selectedRelated.length > 0 && (
              <p className="selection-count">{selectedRelated.length} Articles Linked</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn-save-main">
          Publish to NationScope
        </button>
      </form>
    </div>
  );
}

export default Dashboard;