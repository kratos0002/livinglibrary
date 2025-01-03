import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookPage from './pages/BookPage';
import Navbar from "./components/Navbar";
import ChatLibrarian from './pages/ChatLibrarian';
import ChatCharacter from './pages/ChatCharacter';
import ChatRaskolnikov from './pages/ChatCharacter';
import Home from './pages/home';
import AddBookForm from './pages/AddBookForm';

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>The Living Library (POC)</h1>
        <Routes>
        <Route path="/" element={<Home />} />          {/* Add a route for "/" */}
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/chat/librarian/:bookId" element={<ChatLibrarian />} />
          <Route path="/chat/character/:characterName" element={<ChatCharacter />} />
          <Route path="/books/add/:userId" element={<AddBookForm />} />

          </Routes>
      </div>
    </Router>
  );
}

export default App;
