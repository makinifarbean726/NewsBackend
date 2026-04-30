import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import Sidebar from "./components/Sidebar";

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
      </Routes>

      {/* FOOTER (always visible) */}
      <Footer />
      <Sidebar />
    </BrowserRouter>
  );
}

export default App;