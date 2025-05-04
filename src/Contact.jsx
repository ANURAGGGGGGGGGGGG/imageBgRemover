import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Css/Contact.css";

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Environment variables
  const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    emailjs
      .sendForm(serviceID, templateID, e.target, publicKey)
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          setSubmitted(true);
          e.target.reset();
        },
        (error) => {
          console.error("Error sending email:", error.text);
          setError("Failed to send message. Please try again later.");
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      
      {submitted ? (
        <div className="thank-you">
          <p>Thank you for contacting us! We'll get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <input 
            type="hidden" 
            name="to_name" 
            value="Admin" 
          />
          
          <div className="form-group">
            <label htmlFor="from_name">Your Name:</label>
            <input 
              type="text" 
              name="from_name" 
              id="from_name" 
              required
              minLength="2"
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input 
              type="text" 
              name="subject" 
              id="subject" 
              required
              minLength="5"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea 
              name="message" 
              id="message" 
              required
              minLength="10"
              maxLength="500"
              rows="4"
            ></textarea>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;