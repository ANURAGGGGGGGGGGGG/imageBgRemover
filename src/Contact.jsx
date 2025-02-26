import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Css/Contact.css";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  // Retrieve EmailJS credentials from environment variables
  const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  console.log("EmailJS Public Key:", publicKey);


  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(serviceID, templateID, e.target, publicKey)
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          setSubmitted(true);
        },
        (error) => {
          console.error("Error sending email:", error.text);
        }
      );

    e.target.reset();
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
          {/* Hidden field for the recipient's name as used in the email template */}
          <input type="hidden" name="to_name" value="Admin" />
          
          <div className="form-group">
            <label htmlFor="from_name">Your Name:</label>
            <input type="text" name="from_name" id="from_name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" name="subject" id="subject" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea name="message" id="message" required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;
