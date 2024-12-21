import React, { useState } from 'react';
import axios from 'axios';

const ChatLibrarian = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponses, setChatResponses] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/chat/librarian', {
        userMessage,
        bookId: 'crime_and_punishment'
      });
      const { librarianMessage } = response.data;
      setChatResponses(prev => [...prev, { user: userMessage, librarian: librarianMessage }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error chatting with librarian:', error);
    }
  };

  return (
    <div>
      <h2>Ask the Librarian</h2>
      {chatResponses.map((resp, idx) => (
        <div key={idx}>
          <p><strong>You:</strong> {resp.user}</p>
          <p><strong>Librarian:</strong> {resp.librarian}</p>
          <hr />
        </div>
      ))}
      <input
        type="text"
        placeholder="Ask about Crime and Punishment..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatLibrarian;
