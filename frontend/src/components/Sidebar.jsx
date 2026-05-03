import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // =========================
  // FETCH CATEGORIES FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories"); // ✅ public route
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Optional: simple icon mapping
  const getIcon = (name) => {
    const map = {
      politics: "🏛️",
      business: "📈",
      technology: "💻",
      sports: "⚽",
      entertainment: "🎬",
      health: "🏥",
      environment: "🌱",
      science: "🔬",
    };

    return map[name.toLowerCase()] || "📰";
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰ <span>MENU</span>
          </button>
          <div className="nav-logo">
            Nation<span>Scope</span>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-content">
          
          {/* =========================
              CATEGORIES (DYNAMIC)
          ========================= */}
          <div className="sidebar-section">
            <p className="section-label">Categories</p>
            <ul className="sidebar-list">
              {categories.map((cat) => (
                <li key={cat.id} className="sidebar-item">
                  <Link to={`/category/${cat.slug}`}>
                    <span className="item-icon">
                      {getIcon(cat.name)}
                    </span>
                    <span className="item-text">{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =========================
              STATIC LIBRARY
          ========================= */}
          <div className="sidebar-section">
            <p className="section-label">Library</p>
            <ul className="sidebar-list">
              <li className="sidebar-item">
                <Link to="/trending">
                  <span className="item-icon">🔥</span>
                  <span className="item-text">Trending</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/bookmarks">
                  <span className="item-icon">🔖</span>
                  <span className="item-text">Saved Stories</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/archive">
                  <span className="item-icon">📂</span>
                  <span className="item-text">Archives</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </aside>

      {/* OVERLAY */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}

export default Sidebar;