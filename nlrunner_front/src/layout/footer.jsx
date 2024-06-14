import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content">
        <div className="logo">
        <i className="fas fa-brain"></i> {/* FontAwesome 아이콘 사용 */}
        </div>
        <div className="links">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </div>
        <div className="social-media">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
        <div className="newsletter">
          <input type="email" placeholder="Your email" />
          <button type="button">Subscribe</button>
        </div>
        <div className="company-info">
          <p>© 2023 Your Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
