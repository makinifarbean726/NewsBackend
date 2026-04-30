import { Link } from "react-router-dom";
import "./ArticleCard.css";

// default image (your local asset)
import defaultImage from "../assets/WhatsApp Image 2026-04-28 at 10.50.40.jpeg";

function ArticleCard({ article }) {

  const media = article.media?.[0]; // will work later when backend supports it

  const renderMedia = () => {
    // ✅ fallback when no media exists
    if (!media) {
      return (
        <img
          className="article-media-element"
          src={defaultImage}
          alt="default article"
        />
      );
    }

    // VIDEO
    if (media.file_type === "mp4" || media.file_type === "video") {
      return (
        <video className="article-media-element" muted>
          <source src={media.file_url} />
        </video>
      );
    }

    // IMAGE
    if (
      media.file_type === "jpg" ||
      media.file_type === "jpeg" ||
      media.file_type === "png" ||
      media.file_type === "image"
    ) {
      return (
        <img
          className="article-media-element"
          src={media.file_url}
          alt={media.title || "article image"}
        />
      );
    }

    // fallback for unknown types
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

          <p className="article-card-excerpt">
            {getExcerpt(article.content)}
          </p>

          <div className="article-card-meta">
            <span className="article-date">
              {new Date(article.created_at).toLocaleDateString()}
            </span>
            <span className="read-more-label">Read Full Story →</span>
          </div>
        </div>

        <div className="article-card-accent-bar"></div>

      </div>
    </Link>
  );
}

export default ArticleCard;