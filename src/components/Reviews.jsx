import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import './Reviews.css';

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Bride",
    content: "Brindha preserved my wedding garland so beautifully. It's now a centerpiece in my living room, and every time I look at it, I relive that day.",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Gift Enthusiast",
    content: "The custom name keychain I ordered was even better than expected. The quality of the resin is crystal clear and the gold leaf work is exquisite.",
    rating: 5
  },
  {
    id: 3,
    name: "Ananya Iyer",
    role: "Art Collector",
    content: "I've bought several pieces from Brindha's Resin Studio. Each one is a unique masterpiece. The attention to detail is truly world-class.",
    rating: 5
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header text-center"
        >
          <h2 className="heading-luxury">Kind Words</h2>
          <p className="subtitle">Stories of preserved memories and handcrafted love.</p>
        </motion.div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="review-card glass-panel"
            >
              <div className="quote-icon">
                <Quote size={40} />
              </div>
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--soft-gold)" color="var(--soft-gold)" />
                ))}
              </div>
              <p className="review-content">{review.content}</p>
              <div className="review-author">
                <div className="author-info">
                  <h4>{review.name}</h4>
                  <span>{review.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
