// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import About from "./pages/about/about"
import Contact from "./pages/contact/contact"
import Blog from "./pages/blog/blog"
import Projects from "./pages/projects/projects"
import Project from "./pages/project/project"
import Article from "./pages/article/article";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<Project />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
