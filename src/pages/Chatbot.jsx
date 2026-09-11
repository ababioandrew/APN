import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './Chatbot.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: '👋 Hello! I can assist you with the following:' },
    { type: 'bot', text: '✨ Choose an option below:' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // =========================================
  // SEND EMAIL VIA BACKEND API (Nodemailer)
  // Uses centralized config — works locally
  // (via proxy) AND on Vercel (relative path).
  // =========================================
  const sendEmail = async (text) => {
    try {
      await fetch(API_ENDPOINTS.sendEnquiry, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  };

  // =========================================
  // CLEAR INITIAL GREETING MESSAGES
  // =========================================
  const clearInitialBotMessages = () => {
    setMessages(prev =>
      prev.filter(
        msg =>
          !(
            msg.text.includes('Hello!') ||
            msg.text.includes('Choose an option below:')
          )
      )
    );
  };

  // =========================================
  // HANDLE BUTTON OPTIONS
  // =========================================
  const handleOption = (option) => {
    clearInitialBotMessages();
    setIsTyping(true);

    setTimeout(() => {
      let response = '';

      switch (option) {
        case 'Enquiries':
          response = ` 📩 Please enter your enquiry below.<br><br>
          <strong>Email Us:</strong> <a class="chat-link" href="mailto:Answeredprayernetwork@gmail.com" target="_blank" rel="noopener noreferrer">Answeredprayernetwork@gmail.com</a><br>
          <strong>WhatsApp Us:</strong> <a class="chat-link" href="https://wa.me/233207464426" target="_blank" rel="noopener noreferrer">233207464426</a>`;
          break;

        case 'Contacts':
          response = '📱 Send a message to WhatsApp number: <a class="chat-link" href="https://wa.me/233207464426" target="_blank" rel="noopener noreferrer">233207464426</a>';
          break;

        case 'Initiatives':
          response = '💡 Share your ideas with us!';
          break;

        case 'Remarks':
          response = '📝 You can type your remarks freely.';
          break;

        case 'Book a Meeting':
          response = '📅 To meet the pastor, please provide your preferred date/time.';
          break;

        default:
          response = '❓ Option not recognized.';
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  // =========================================
  // SEND MESSAGE
  // =========================================
  const sendMessage = () => {
  if (!input.trim()) return;
  clearInitialBotMessages();
  setMessages([...messages, { type: 'user', text: input }]);

  sendEmail(input);
  window.open(`https://wa.me/233207464426?text=${encodeURIComponent(input)}`, '_blank');

  setMessages(prev => [...prev,
  { type: 'bot', text: '✅ Your message has been sent via WhatsApp and email.' }
  ]);

  setInput('');
};
  // =========================================
  // RENDER
  // =========================================
  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <h2>💬 Church Chatbot</h2>
        <p>Ask us about enquiries, contacts, initiatives, remarks, or book a meeting.</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.type}`}>
            <div className="avatar">
              {msg.type === 'bot' ? '🤖' : '🧑'}
            </div>
            <div
              className={`message ${msg.type}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="chatbot-options">
        {['Enquiries', 'Contacts', 'Initiatives', 'Remarks', 'Book a Meeting'].map(opt => (
          <button key={opt} onClick={() => handleOption(opt)}>{opt}</button>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}