import { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import "./Home.css";
import MessageSender from "../components/MessageSender";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/articles");
      setArticles(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.slice(1);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="main-logo">Nation<span>Scope</span></h1>
          <div className="header-divider"></div>
          <p className="tagline">Beyond the Headlines</p>
          
          {/* SYMBOLIC SEARCH BAR */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search news, topics, or nations..." 
              className="symbolic-search"
              disabled 
            />
            <button className="search-icon-btn">🔍</button>
          </div>
        </div>
      </header>

      <div className="main-content-grid">
        {/* CENTER COLUMN */}
        <main className="center-feed">
          <div className="section-title-wrapper">
            <h2 className="section-title">Top Stories</h2>
            <div className="red-underline"></div>
          </div>

          {loading && <div className="loader">Loading updates...</div>}
          {error && <p className="error-msg">{error}</p>}

          {featuredArticle && (
            <div className="featured-article-hero">
              <ArticleCard 
                article={featuredArticle} 
                isFeatured={true} 
                isAdmin={isAdmin} 
              />
              <div className="featured-badge">FEATURED STORY</div>
            </div>
          )}

          <div className="standard-article-grid">
            {remainingArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        </main>

        {/* RIGHT COLUMN */}
        <aside className="right-summary-sidebar">
          <div className="sidebar-header">
            <span className="live-dot"></span>
            <h3 className="sidebar-title">Live Updates</h3>
          </div>

          <div className="summary-list">
            {articles.slice(0, 8).map((article, index) => (
              <div key={`summary-${index}`} className="summary-card">
                <span className="summary-index">0{index + 1}</span>
                <p className="summary-headline">{article.title}</p>
                {isAdmin && (
                  <div className="summary-views">
                    👁 {article.views || 0}
                  </div>
                )}
                <div className="summary-footer">2 mins ago</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* BOTTOM CAROUSEL */}
      {!loading && (
        <section className="bottom-scroll-section">
          <div className="carousel-inner-wrap">
            <h3 className="carousel-label">Recommended for you</h3>
            <div className="horizontal-scroll-container">
              {articles.map((article) => (
                <div key={`carousel-${article.id}`} className="scroll-item-card">
                  <div className="scroll-img-wrapper">
                    <img
                      src={article.media?.[0]?.file_url || "/placeholder.jpg"}
                      alt=""
                    />
                  </div>
                  <h4 className="scroll-item-title">{article.title}</h4>
                  {isAdmin && (
                    <p className="scroll-views">👁 {article.views || 0}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <MessageSender />
    </div>
  );
}

export default Home;