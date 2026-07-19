import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="contact-container">
      <h2>Contact Me</h2>
      
      <div className="tooltip-section">
        <button 
          onClick={() => setShowTooltip(!showTooltip)} 
          className="help-btn"
        >
          {showTooltip ? 'Hide Help' : 'Need Help?'}
        </button>
        {showTooltip && (
          <div className="tooltip">
            Please enter your message below. We will get back to you as soon as possible!
          </div>
        )}
      </div>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="message">Your Message:</label>
        <textarea 
          id="message"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          rows="5"
          placeholder="Type your message here..."
        />
        <div className="char-count">
          Character count: {message.length}
        </div>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
