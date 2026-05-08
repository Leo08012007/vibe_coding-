import React, { useState } from 'react';
import { Camera, Globe, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer id="contact" className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="heading-luxury glowing-text" style={{ fontSize: '2rem' }}>Brindha's Resin Studio</h2>
          <p>Handcrafted with Love,<br/>Preserved Forever</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#collections">Collections</a></li>
            <li><a href="#custom-orders">Custom Orders</a></li>
            <li><a href="#about">About Brindha</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><Mail size={16}/> brindharesinstudio@gmail.com</p>
          <p><MapPin size={16}/> Chennai, Tamil Nadu (Shipping all over India)</p>
          <div className="social-icons">
            <a href="#" className="glass-button icon-btn"><Camera size={20}/></a>
            <a href="#" className="glass-button icon-btn"><Globe size={20}/></a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive drops and magical updates.</p>
          <div className="newsletter-input" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.button 
                  key="sub-btn"
                  className="glass-button" 
                  onClick={() => setSubscribed(true)}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  Subscribe
                </motion.button>
              ) : (
                <motion.div 
                  key="sub-msg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-msg"
                  style={{ color: 'var(--soft-gold)', fontWeight: '500' }}
                >
                  Thanks for your subscription! ✨
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Brindha's Resin Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
