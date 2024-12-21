// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "#2C3E50",
        color: "#FFF"
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "#FFF", fontSize: "1.2rem" }}>
        The Living Library
      </Link>
      <div>
        <Link
          to="/"
          style={{ marginRight: "1rem", textDecoration: "none", color: "#FFF" }}
        >
          Home
        </Link>
        <Link to="/chat/librarian" style={{ textDecoration: "none", color: "#FFF" }}>
          Ask the Librarian
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
