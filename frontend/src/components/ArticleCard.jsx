import { Link } from "react-router-dom";
import "./ArticleCard.css";

// default image
import defaultImage from "../assets/WhatsApp Image 2026-04-28 at 10.50.40.jpeg";

const BASE_URL = "http://127.0.0.1:5000";

function ArticleCard({ article, isAdmin }) {
  const media = article.media?.[0];

  const renderMedia = () => {
    if (!media) {
      return (
        <img
          className="article-media-element"
          src={defaultImage}
          alt="default"
        />
      );
    }

    const fullUrl = `${BASE_URL}${media.file_url}`;

    // 🎥 VIDEO
    if (["mp4", "webm"].includes(media.file_type)) {
      return (
        <video className="article-media-element" controls muted>
          <source src={fullUrl} type={`video/${media.file_type}`} />
        </video>
      );
    }

    // 🖼 IMAGE
    if (["jpg", "jpeg", "png", "gif"].includes(media.file_type)) {
      return (
        <img
          className="article-media-element"
          src={fullUrl}
          alt={media.title || "article"}
        />
      );
    }

    return (
      <img
        className="article-media-element"
        src={defaultImage}
        alt="fallback"
      />
    );
  };

  const getExcerpt = (text) => {
    if (!text) return "";
    const clean = text.replace(/<[^>]*>/g, "");
    return clean.length > 120 ? clean.substring(0, 120) + "..." : clean;
  };

  return (
    <Link to={`/article/${article.slug}`} className="article-card-link">
      <div className="article-card-container">

        {/* MEDIA */}
        <div className="article-media-wrapper">
          {renderMedia()}
        </div>

        {/* CONTENT */}
        <div className="article-content-body">
          <h2 className="article-card-title">{article.title}</h2>

          {/* CATEGORY (optional but useful now that you have it) */}
          {article.category && (
            <p className="article-category">
              {article.category.name}
            </p>
          )}

          <p className="article-card-excerpt">
            {getExcerpt(article.content)}
          </p>

          <div className="article-card-meta">
            <span className="article-date">
              {new Date(article.created_at).toLocaleDateString()}
            </span>

            {/* 🔥 ADMIN ONLY VIEWS */}
            {isAdmin && article.views !== undefined && (
              <span className="article-views">
                👁 {article.views}
              </span>
            )}

            <span className="read-more-label">Read Full Story →</span>
          </div>
        </div>

        <div className="article-card-accent-bar"></div>
      </div>
    </Link>
  );
}

export default ArticleCard;