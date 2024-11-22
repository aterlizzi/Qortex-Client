'use client';

import { useEffect, useState } from 'react';
import styles from './ChatBox.module.css';

// Constant UserID (replace with your desired UUID)
const USER_ID = "123e4567-e89b-12d3-a456-426614174000";

export default function ChatBox() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://0.0.0.0:1338/agent');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (e, clearChat = false) => {
    e?.preventDefault(); // Make preventDefault optional
    setMessages((prev) => [...prev, inputMessage])
    if (socket && (inputMessage.trim() || clearChat)) {
      const message = {
        userID: USER_ID,
        question: clearChat ? "Clear chat" : inputMessage,
        clearChat: clearChat
      };
      socket.send(JSON.stringify(message));
      if (!clearChat) {
        setInputMessage('');
      }
    }
  };

  const handleClearChat = (e) => {
    sendMessage(e, true);
    setMessages([]); // Clear messages locally
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h2>Chat</h2>
        <button 
          onClick={handleClearChat}
          className={styles.clearButton}
        >
          Clear Chat
        </button>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div key={index} className={styles.message}>
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => sendMessage(e, false)} className={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your question..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}