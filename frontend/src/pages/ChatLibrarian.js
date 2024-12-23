import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatLibrarian = () => {
  const { bookId } = useParams(); // Dynamically get bookId from the route
  const [userMessage, setUserMessage] = useState('');
  const [chatResponses, setChatResponses] = useState([]);
  const [bookTitle, setBookTitle] = useState('');

  // Fetch the book's title for context (optional)
  useEffect(() => {
    axios
      .get(`https://livinglibrary.onrender.com/api/book/${bookId}`)
      .then((response) => {
        setBookTitle(response.data.book.title || 'the book');
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
        setBookTitle('the book'); // Fallback title
      });
  }, [bookId]);

  const sendMessage = async () => {
    try {
      const response = await axios.post('https://livinglibrary.onrender.com/api/chat/librarian', {
        userMessage,
        bookId, // Dynamically send the bookId
      });
      const { librarianMessage } = response.data;
      setChatResponses((prev) => [...prev, { user: userMessage, librarian: librarianMessage }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error chatting with librarian:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Ask the Librarian</h2>
      <p>You're asking about <strong>{bookTitle}</strong>.</p>
      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px', marginBottom: '1rem', height: '300px', overflowY: 'auto' }}>
        {chatResponses.map((resp, idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <p><strong>You:</strong> {resp.user}</p>
            <p><strong>Librarian:</strong> {resp.librarian}</p>
            <hr />
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder={`Ask about ${bookTitle}...`}
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: '0.5rem 1rem', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatLibrarian;
