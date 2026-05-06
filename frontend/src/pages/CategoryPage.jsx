import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./CategoryPage.css"; // Ensure this is imported

function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${slug}`);
        const cat = res.data;
        setCategory(cat);

        const articlePromises = cat.articles.map(async (a) => {
          const articleRes = await api.get(`/articles/${a.slug}`);
          return articleRes.data;
        });

        const fullArticles = await Promise.all(articlePromises);
        setArticles(fullArticles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slug]);

  if (loading) return <div className="loader-container"><div className="loader-spinner" /></div>;
  if (!category) return <div className="error-message">Category not found</div>;

  return (
    <div className="category-page-container">
      <header className="category-header">
        <div className="category-label">Browsing Category</div>
        <h1 className="category-name">{category.name}</h1>
      </header>

      <div className="category-feed">
        {articles.length === 0 ? (
          <div className="no-articles">No stories found in this section.</div>
        ) : (
          articles.map((article) => (
            <article 
              key={article.id} 
              className="cat-story-card"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              {article.media?.length > 0 && (
                <div className="cat-story-img-wrapper">
                  <img
                    src={`http://127.0.0.1:5000${article.media[0].file_url}`}
                    alt={article.title}
                  />
                </div>
              )}
              
              <div className="cat-story-content">
                <h3 className="cat-story-title">{article.title}</h3>
                <p className="cat-story-excerpt">
                  {article.content?.slice(0, 180)}...
                </p>
                <div className="cat-story-meta">
                  <span className="cat-story-date">
                    {new Date(article.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                  </span>
                  <span className="read-more">Read Full Story →</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;