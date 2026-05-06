import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  const authPages = ["/login", "/signup"];
  if (authPages.includes(location.pathname)) return null;

  useEffect(() => {
    // Handle screen resizing
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false); // Reset toggle state if scaling back to desktop
    };

    window.addEventListener("resize", handleResize);
    
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use toggle for mobile, hover for desktop
  const sidebarClass = isMobile 
    ? (isOpen ? "expanded mobile-open" : "collapsed mobile-closed") 
    : (isOpen ? "expanded" : "collapsed");

  const handleMouseEnter = () => { if (!isMobile) setIsOpen(true); };
  const handleMouseLeave = () => { if (!isMobile) setIsOpen(false); };
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button - Only visible < 768px */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      <aside 
        className={`ns-sidebar ${sidebarClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-logo-area">
          <h2 className="sidebar-brand">
            {isOpen ? <>Nation<span>Scope</span>News</> : <span>☰</span>}
          </h2>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/")}>
            <span className="nav-icon">🏠</span>
            {isOpen && <span className="nav-text">Home</span>}
          </div>

          <div className="sidebar-divider">
            {isOpen ? <span>Categories</span> : <div className="divider-line" />}
          </div>

          <div className="category-scroll-list">
            {categories.map((c) => (
              <div
                key={c.id}
                className={`nav-item ${location.pathname.includes(c.slug) ? 'active' : ''}`}
                onClick={() => {
                  navigate(`/category/${c.slug}`);
                  if (isMobile) setIsOpen(false); // Auto-close on click for mobile
                }}
              >
                <span className="nav-icon">📁</span>
                {isOpen && <span className="nav-text">{c.name}</span>}
              </div>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>{isOpen ? "© 2026 NationScopeNews" : "©"}</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;