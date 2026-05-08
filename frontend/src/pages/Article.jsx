import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import MessageSender from "../components/MessageSender";
import "./Article.css";

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Anonymous";
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error("ARTICLE ERROR:", err);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article?.id) return;
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get(`/comments/article/${article.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data || []);
      } catch (err) {
        console.error("FETCH COMMENTS ERROR:", err);
      }
    };
    fetchComments();
  }, [article?.id]);

  const handleComment = async () => {
    if (!comment.trim() || !article?.id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to join the conversation.");
      return;
    }
    try {
      const formattedComment = `${username}: ${comment}`;
      await api.post("/comments", 
        { content: formattedComment, article_id: article.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      const res = await api.get(`/comments/article/${article.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data || []);
    } catch (err) {
      console.error("COMMENT ERROR:", err);
    }
  };

  if (!article) return (
    <div className="article-loader-container">
      <div className="loader-spinner"></div>
      <div className="loader-text">NATION<span>SCOPE</span></div>
    </div>
  );

  return (
    <div className={`article-page-wrapper ${isSidebarExpanded ? "sb-open" : ""}`}>
      <Sidebar onToggle={(val) => setIsSidebarExpanded(val)} />

      <main className="article-content-container">
        <header className="article-view-header">
          <div className="category-tag">Full Report</div>
          <h1 className="article-view-title">{article.title}</h1>
          
          <div className="article-view-meta">
            <span className="meta-author">By {article.author?.username || "NationScope Editor"}</span>
            <span className="meta-sep">/</span>
            <span className="meta-date">{new Date().toLocaleDateString()}</span>
            {isAdmin && <span className="meta-views-badge">👁 {article.views} Views</span>}
          </div>
        </header>

        {/* IMAGE CARDS SECTION */}
        <section className="article-media-grid">
          {article.media?.map((m) => (
            <div key={m.id} className="media-card">
              <img
                src={m.file_url.startsWith("http") ? m.file_url : `http://127.0.0.1:5000${m.file_url}`}
                alt="Article Visual"
                className="media-card-img"
              />
              <div className="media-card-accent"></div>
            </div>
          ))}
        </section>

        <article className="article-rich-text">
          {article.content}
        </article>

        <section className="article-comments-area">
          <h3 className="discussion-heading">Comments</h3>
          
          <div className="comment-box-styled">
            <textarea
              className="comment-field"
              placeholder="Join the discussion..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="comment-submit-btn" onClick={handleComment}>
              Post Response
            </button>
          </div>

          <div className="comments-stack">
            {comments.map((c) => (
              <div key={c.id} className="comment-item-card">
                <div className="comment-user-icon">{c.content.charAt(0)}</div>
                <div className="comment-text-wrapper">
                  <p>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isAdmin && (
          <button 
            className="floating-edit-btn" 
            onClick={() => navigate(`/edit-article/${article.id}`)}
          >
            ✏️
          </button>
        )}
      </main>
      <MessageSender />
    </div>
  );
};

export default Article;