import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import "./EditArticle.css";

function EditArticle() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  
  // Logic for the Related Search Bar
  const [relatedQuery, setRelatedQuery] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRelated, setSelectedRelated] = useState([]);
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [artRes, catRes] = await Promise.all([
        api.get("/articles"),
        api.get("/categories"),
      ]);

      const allArticles = artRes.data || [];
      const current = allArticles.find((a) => a.id == id);

      setArticles(allArticles);
      setCategories(catRes.data || []);
      setArticle(current || null);

      if (current) {
        setTitle(current.title || "");
        setContent(current.content || "");
        setSelectedCategories(current.categories?.map((c) => c.id) || []);
        setSelectedRelated(current.related?.map((r) => r.id) || []);
      }
    } catch (err) {
      console.error("FETCH DATA ERROR:", err.response?.data || err);
    }
  };

  // Filter logic: Search through all articles except the current one
  const filteredArticles = articles.filter((a) => {
    const isNotCurrent = a.id != id;
    const matchesQuery = a.title.toLowerCase().includes(relatedQuery.toLowerCase());
    return isNotCurrent && matchesQuery;
  });

  const updateArticle = async () => {
    try {
      await api.put(
        `/articles/${id}`,
        {
          title,
          content,
          category_ids: selectedCategories,
          related_ids: selectedRelated,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Article updated successfully");
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err);
    }
  };

  const uploadMedia = async () => {
    if (!files.length) return;
    const formData = new FormData();
    for (let f of files) { formData.append("files", f); }

    try {
      await api.post(`/media/attach/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Media added");
      setFiles([]);
      fetchData();
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
    }
  };

  const deleteMedia = async (mediaId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/media/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("DELETE MEDIA ERROR:", err.response?.data || err);
    }
  };

  const deleteAllMedia = async () => {
    if (!window.confirm("Delete ALL media?")) return;
    try {
      await api.delete(`/media/article/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("DELETE ALL ERROR:", err.response?.data || err);
    }
  };

  if (!article) return <div className="article-loader-container"><div className="loader-spinner" /></div>;

  return (
    <div className="edit-article-container">
      <h1>Edit Article</h1>

      <div className="form-section">
        <h3>Headline</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title..."
        />

        <h3>Article Body</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Write your story..."
        />
      </div>

      <div className="taxonomy-grid">
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

        <div className="taxonomy-column">
          <h3>Attach Related Stories</h3>
          
          {/* SEARCH BOX FOR RELATED ARTICLES */}
          <div className="related-search-wrapper">
             <div className="search-input-wrapper miniature">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Find stories to link..."
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
              <p className="no-results">No stories found...</p>
            )}
          </div>
          {selectedRelated.length > 0 && (
            <p className="selection-count">{selectedRelated.length} stories attached</p>
          )}
        </div>
      </div>

      <button className="btn-save-main" onClick={updateArticle}>
        Save Changes
      </button>

      <div className="media-management-section">
        <h3>Media Gallery</h3>
        <div className="media-gallery">
          {article.media?.map((m) => (
            <div key={m.id} className="media-item">
              <img
                src={m.file_url.startsWith('http') ? m.file_url : `http://127.0.0.1:5000${m.file_url}`}
                alt="media"
              />
              <button className="btn-delete-small" onClick={() => deleteMedia(m.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="media-controls">
          <div className="upload-box">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
            <button className="btn-upload" onClick={uploadMedia}>
              Upload New Media
            </button>
          </div>
          
          <button className="btn-danger-all" onClick={deleteAllMedia}>
            Wipe All Media
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditArticle;