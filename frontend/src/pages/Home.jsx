import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import MessageSender from "../components/MessageSender";
import SearchBar from "../components/SearchBar";
import fallbackImg from "../assets/WhatsApp Image 2026-04-28 at 10.50.40.jpeg";
import "./Home.css";

function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState({});
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetching 15+ articles to populate the large main feed
        const res = await api.get("/articles");
        const data = res.data || [];

        setArticles(data);
        buildTrending(data);
        groupAndSetCategories(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const groupAndSetCategories = (data) => {
    const grouped = {};
    data.forEach((article) => {
      const articleCats = article.categories || [];
      articleCats.forEach((cat) => {
        if (!grouped[cat.id]) {
          grouped[cat.id] = {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            articles: [],
          };
        }
        grouped[cat.id].articles.push(article);
      });
    });
    setCategories(grouped);
  };

  const buildTrending = (data) => {
    const sorted = [...data].sort((a, b) => b.views - a.views);
    setTrending(sorted.slice(0, 6));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImage = (article) => {
    const media = article.media?.[0];
    if (!media?.file_url) return fallbackImg;
    return media.file_url.startsWith("http")
      ? media.file_url
      : `http://127.0.0.1:5000${media.file_url}`;
  };

  // Logic to split the 15 articles
  const topStory = articles[0];
  const feedStories = articles.slice(1, 15); // Displays next 14 articles

  if (loading) return <div className="ns-loader">Loading NationScope...</div>;

  return (
        <div className={`app-container ${mobileMenuOpen ? "nav-is-open" : ""}`}>
          {/* Global Overlay */}
          {mobileMenuOpen && (
            <div className="ui-overlay" onClick={() => setMobileMenuOpen(false)} />
          )}

          <main className="main-layout">
            
            {/* 1. TOP NAVIGATION HEADER */}
            <header className="navbar">
              <div className="navbar__brand" onClick={() => navigate("/")}>
                <img src={fallbackImg} alt="NationScope Logo" className="navbar__logo" />
                <div className="navbar__title-group">
                  <h1 className="navbar__title">
                    Nation<span>Scope</span>News
                  </h1>
                  <p className="navbar__motto">BEYOND THE HEADLINES</p>
                </div>
              </div>
                <div className="navbar_row">
                <div className="navbar__search">
                  <SearchBar />
                </div>
              </div>
            </header>

            {topStory && (
              <section className="hero" onClick={() => navigate(`/article/${topStory.slug}`)}>
                <div className="hero__card">
                  <div className="hero__image-container">
                    <img src={getImage(topStory)} alt="Featured" className="hero__img" />
                    <span className="badge badge--featured">Featured Story</span>
                  </div>
                  <div className="hero__content">
                    <h2 className="hero__title">{topStory.title}</h2>
                    <p className="hero__excerpt">{topStory.content?.slice(0, 250)}...</p>
                    <div className="article-meta">
                      <span className="article-meta__author">By {topStory.author?.username}</span>
                      <span className="article-meta__divider"></span>
                      <span className="article-meta__date">{formatDate(topStory.created_at)}</span>
                      {isAdmin && <span className="badge badge--views">Views: {topStory.views}</span>}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="content-shell">
              <section className="feed">
                <h3 className="section-title">Latest Stories</h3>
                <div className="feed__grid">
                  {feedStories.map((a) => (
                    <article key={a.id} className="story-card" onClick={() => navigate(`/article/${a.slug}`)}>
                      <div className="story-card__image-holder">
                        <img src={getImage(a)} alt={a.title} className="story-card__img" />
                      </div>
                      <div className="story-card__body">
                        <h3 className="story-card__title">{a.title}</h3>
                        <p className="story-card__excerpt">{a.content?.slice(0, 100)}...</p>
                        <div className="article-meta article-meta--small">
                          <span>{a.author?.username}</span>
                          <span className="article-meta__divider"></span>
                          <span>{formatDate(a.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SIDEBAR COLUMN (Reserved 25%) */}
              <aside className="sidebar">
                <div className="sidebar__sticky">
                  <h3 className="section-title">🔥 Hot Picks</h3>
                  <div className="trending-list">
                    {trending.map((a, index) => (
                      <div key={a.id} className="trend-item" onClick={() => navigate(`/article/${a.slug}`)}>
                        <span className="trend-item__rank">0{index + 1}</span>
                        <div className="trend-item__info">
                          <h4 className="trend-item__title">{a.title}</h4>
                          <small className="trend-item__author">{a.author?.username}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sidebar__widget">
                    <MessageSender />
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      );
      }

export default Home;