import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const categories = [
    { name: "Politics", icon: "🏛️" },
    { name: "Business", icon: "📈" },
    { name: "Technology", icon: "💻" },
    { name: "Sports", icon: "⚽" },
    { name: "Entertainment", icon: "🎬" },
    { name: "Health", icon: "🏥" },
    { name: "Environment", icon: "🌱" },
  ];

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

      {/* DYNAMIC SIDEBAR */}
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <p className="section-label">Categories</p>
            <ul className="sidebar-list">
              {categories.map((cat) => (
                <li key={cat.name} className="sidebar-item">
                  <Link to={`/category/${cat.name.toLowerCase()}`}>
                    <span className="item-icon">{cat.icon}</span>
                    <span className="item-text">{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
      
      {/* OVERLAY for mobile/small screens when menu is forced open */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Sidebar;