import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Article from "./pages/Article";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CategoryPage from "./pages/CategoryPage";
import Messages from "./components/Messages";
import SearchResults from "./pages/SearchResults";
import EditArticle from "./pages/EditArticle";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

// =========================
// LAYOUT WRAPPER
// =========================
function Layout({ children }) {
  const location = useLocation();

  // ❌ hide sidebar on auth pages
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div style={{ display: "block" }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

// =========================
// APP ROUTES
// =========================
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/msgg" element={<Messages />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/edit-article/:id" element={<EditArticle />} />
        </Routes>
        <Footer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;