import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Article.css";

function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="article-loading-container">
      <div className="article-loader"></div>
      <p>Fetching full story...</p>
    </div>
  );

  if (!article) return <div className="article-error">Article not found.</div>;

  return (
    <article className="article-page-container">
      {/* HEADER SECTION */}
      <header className="article-header">
        <div className="category-badge">Breaking News</div>
        <h1 className="article-main-title">{article.title}</h1>
        
        <div className="article-author-meta">
          <div className="author-info">
            <span className="by-line">By</span> <strong>NationScope Editorial</strong>
          </div>
          <div className="publish-date">
            Published: {new Date(article.created_at).toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <div className="header-decoration">
          <div className="line-red"></div>
          <div className="line-blue"></div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <main className="article-body-wrapper">
        <div 
          className="article-rich-content"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </main>

      {/* FOOTER OF ARTICLE */}
      <footer className="article-end-meta">
        <button className="share-btn">Share this story</button>
        <div className="article-tags">
          <span>#NationScope</span>
          <span>#BeyondTheHeadlines</span>
          <span>#NewsUpdate</span>
        </div>
      </footer>
    </article>
  );
}

export default Article;