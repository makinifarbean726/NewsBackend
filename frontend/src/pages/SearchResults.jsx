import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("q");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/articles/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (query) fetchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <header className="search-header">
        <h2 className="search-title">
          Search Results for <span>"{query}"</span>
        </h2>
        <p className="search-count">{results.length} stories discovered</p>
      </header>

      <div className="results-list">
        {results.length === 0 ? (
          <div className="no-results-box">
            <p>We couldn't find any stories matching your search.</p>
            <button onClick={() => navigate("/")} className="back-home-btn">Return to Headlines</button>
          </div>
        ) : (
          results.map((a) => (
            <div
              key={a.id}
              className="search-item-card"
              onClick={() => navigate(`/article/${a.slug}`)}
            >
              <div className="search-item-info">
                <h3 className="search-item-title">{a.title}</h3>
                <p className="search-item-excerpt">{a.content.slice(0, 150)}...</p>
                <div className="search-item-footer">
                   <span className="read-more-link">View Full Report →</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchResults;