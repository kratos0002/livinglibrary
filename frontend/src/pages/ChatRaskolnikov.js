import React, { useState } from 'react';
import axios from 'axios';

const ChatRaskolnikov = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post('https://livinglibrary.onrender.com/api/chat/raskolnikov', {
        userMessage
      });
      const { raskolnikovMessage } = response.data;
      setChatLog(prev => [...prev, { user: userMessage, raskolnikov: raskolnikovMessage }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error chatting with Raskolnikov:', error);
    }
  };

  return (
    <div>
      <h2>Chat with Raskolnikov</h2>
      {chatLog.map((entry, idx) => (
        <div key={idx}>
          <p><strong>You:</strong> {entry.user}</p>
          <p><strong>Raskolnikov:</strong> {entry.raskolnikov}</p>
          <hr />
        </div>
      ))}
      <input
        type="text"
        placeholder="Ask Raskolnikov about his thoughts..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRaskolnikov;
