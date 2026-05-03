import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";

function CategoryPage() {
  const { slug } = useParams();

  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ARTICLES
  // =========================
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // =========================
  // FILTER BY CATEGORY
  // =========================
  useEffect(() => {
    if (!slug) return;

    const filteredArticles = articles.filter(
      (article) =>
        article.category?.slug?.toLowerCase() === slug.toLowerCase()
    );

    setFiltered(filteredArticles);
  }, [slug, articles]);

  // =========================
  // UI STATES
  // =========================
  if (loading) {
    return (
      <div className="category-loading">
        <div className="loader"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      
      {/* HEADER */}
      <div className="category-header">
        <h1 className="category-title">
          {slug?.toUpperCase()}
        </h1>
        <p className="category-subtitle">
          Showing {filtered.length} article(s)
        </p>
      </div>

      {/* ARTICLES */}
      {filtered.length === 0 ? (
        <div className="category-empty">
          No articles found in this category.
        </div>
      ) : (
        <div className="category-grid">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;