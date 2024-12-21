import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookPage from './pages/BookPage';
import ChatLibrarian from './pages/ChatLibrarian';
import ChatRaskolnikov from './pages/ChatRaskolnikov';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>The Living Library (POC)</h1>
        <Routes>
        <Route path="/" element={<Home />} />          {/* Add a route for "/" */}
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/chat/librarian" element={<ChatLibrarian />} />
          <Route path="/chat/raskolnikov" element={<ChatRaskolnikov />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
