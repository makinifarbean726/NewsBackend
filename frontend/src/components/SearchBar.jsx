import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className="ns-search-container" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="ns-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Explore stories..."
        />
        <button type="submit" className="ns-search-button">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;