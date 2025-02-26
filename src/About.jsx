import React from "react";
import "./Css/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Image BG Remover</h1>
        <p>
          Image BG Remover is a simple yet powerful tool that allows you to
          remove the background from images with ease. Whether you're editing
          photos for design projects, e-commerce, or social media, our tool
          makes background removal quick and efficient.
        </p>

        <h2>Why Choose Us?</h2>
        <ul className="about-list">
          <li>🚀 Fast and AI-powered background removal</li>
          <li>🎨 Easy to use with a simple interface</li>
          <li>💡 Supports multiple image formats</li>
          <li>🌙 Light & Dark mode support</li>
          <li>🔄 Continuous improvements for better performance</li>
        </ul>

        <h2>How It Works?</h2>
        <p>
          Just upload an image, and our AI-powered background remover will do
          the magic in seconds. Once processed, you can download the image
          without a background instantly.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? Feel free to{" "}
          <a href="mailto:support@imagebgremover.com">email us</a> or connect
          with us on our social media channels.
        </p>
      </div>
    </div>
  );
}

export default About;
