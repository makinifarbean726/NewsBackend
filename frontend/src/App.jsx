import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import MessageSender from "./components/MessageSender";
import Messages from "./components/Messages";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <BrowserRouter>
      {/* MAIN APP ROUTES */}
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/article/:slug" element={<Article />} />
        <Route path="/msg" element={<MessageSender />} />
        <Route path="/msgg" element={<Messages />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
      </Routes>

      {/* FOOTER (always visible) */}
      <Footer />
      <Sidebar />
    </BrowserRouter>
  );
}

export default App;