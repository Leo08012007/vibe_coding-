import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container about-container">
        <motion.div 
          className="about-image-wrapper holographic-border"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Brindha creating resin art" 
            className="about-image"
          />
        </motion.div>
        
        <motion.div 
          className="about-text"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="heading-luxury">Meet Brindha</h2>
          <h3 className="about-subtitle">The Artist Behind Brindha's Resin Studio</h3>
          <p>
            What started as a passion for preserving the delicate beauty of nature has blossomed into Brindha's Resin Studio. Every petal, every swirl of color, and every sparkle is meticulously placed by hand.
          </p>
          <p>
            "I don't just make art; I preserve emotions. Whether it's the garland from your wedding day or a custom piece for a loved one, my goal is to freeze that beautiful moment in time, forever."
          </p>
          <img src="/signature.png" alt="Brindha Signature" className="signature-img" onError={(e) => e.target.style.display='none'} />
        </motion.div>
      </div>
    </section>
  );
}
