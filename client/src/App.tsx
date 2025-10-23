// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";

// ❗React Router 的动画要配合 AnimatePresence 使用
function AnimatedRoutes() {
  const location = useLocation();

  return (
    // AnimatePresence 用于控制退出动画是否生效
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/article/:id"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ArticleDetail />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// App.tsx 中加载 Router
export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
