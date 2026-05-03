import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Article.css";

const BASE_URL = "http://127.0.0.1:5000";

function Article() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  // =========================
  // FETCH ARTICLE
  // =========================
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // =========================
  // FETCH COMMENTS
  // =========================
  useEffect(() => {
    const fetchComments = async () => {
      if (!article) return;

      try {
        const res = await api.get(`/comments/article/${article.id}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [article]);

  // =========================
  // ADD COMMENT
  // =========================
  const addComment = async () => {
    if (!content.trim()) return;

    try {
      setCommentLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/comments",
        {
          content,
          article_id: article.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");

      // refresh comments
      const res = await api.get(`/comments/article/${article.id}`);
      setComments(res.data);

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add comment (login required)");
    } finally {
      setCommentLoading(false);
    }
  };

  // =========================
  // MEDIA RENDER
  // =========================
  const renderMedia = () => {
    const media = article?.media?.[0];

    if (!media) return null;

    const fullUrl = `${BASE_URL}${media.file_url}`;

    if (["mp4", "webm"].includes(media.file_type)) {
      return (
        <video className="article-main-media" controls>
          <source src={fullUrl} type={`video/${media.file_type}`} />
        </video>
      );
    }

    if (["jpg", "jpeg", "png", "gif"].includes(media.file_type)) {
      return (
        <img
          className="article-main-media"
          src={fullUrl}
          alt={media.title}
        />
      );
    }

    return null;
  };

  // =========================
  // LOADING STATES
  // =========================
  if (loading) return (
    <div className="article-loading-container">
      <div className="article-loader"></div>
      <p>Fetching full story...</p>
    </div>
  );

  if (!article) return <div className="article-error">Article not found.</div>;

  return (
    <article className="article-page-container">

      {/* HEADER */}
      <header className="article-header">
        
        {/* CATEGORY */}
        {article.category && (
          <div className="category-badge">
            {article.category.name}
          </div>
        )}

        <h1 className="article-main-title">{article.title}</h1>

        <div className="article-author-meta">
          <strong>NationScope Editorial</strong>
        </div>

        {/* DATE + VIEWS */}
        <div className="article-meta-extra">
          <span>
            {new Date(article.created_at).toLocaleDateString()}
          </span>

          {/* show views only if admin token exists */}
          {localStorage.getItem("token") && (
            <span>👁 {article.views} views</span>
          )}
        </div>
      </header>

      {/* MEDIA */}
      <div className="article-media-container">
        {renderMedia()}
      </div>

      {/* CONTENT */}
      <main className="article-body-wrapper">
        <div
          className="article-rich-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </main>

      {/* =========================
          COMMENTS SECTION
      ========================= */}
      <section className="comments-section">

        <h2>Comments ({comments.length})</h2>

        {/* ADD COMMENT BOX */}
        <div className="comment-box">
          <textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />

          <button onClick={addComment} disabled={commentLoading}>
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-item">
                <p>{c.content}</p>
                <small>
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>

      </section>

      {/* FOOTER */}
      <footer className="article-end-meta">
        <span>#NationScope</span>
        <span>#{article.category?.name || "News"}</span>
      </footer>

    </article>
  );
}

export default Article;