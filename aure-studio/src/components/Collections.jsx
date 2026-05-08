import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Collections.css';

const products = [
  { id: 1, name: 'Floral Resin Coaster', price: 499, image: '/products/product_1.jpg' },
  { id: 2, name: 'Customized Name Keychain', price: 299, image: '/products/product_2.jpg' },
  { id: 3, name: 'Resin Bookmark', price: 249, image: '/products/product_3.jpg' },
  { id: 4, name: 'Ocean Resin Tray', price: 1499, image: '/products/product_4.jpg' },
  { id: 5, name: 'Resin Jewelry Set', price: 899, image: '/products/product_5.jpg' },
  { id: 6, name: 'Personalized Couple Frame', price: 1999, image: '/products/product_6.jpg' },
  { id: 7, name: 'Resin Wall Clock', price: 2499, image: '/products/product_7.jpg' },
  { id: 8, name: 'Preserved Flower Keepsake', price: 1299, image: '/products/product_8.jpg' },
];

export default function Collections({ onAddToCart }) {
  const [quickViewImage, setQuickViewImage] = useState(null);

  return (
    <section id="collections" className="section collections-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <h2 className="heading-luxury text-center">Timeless Collections</h2>
          <p className="subtitle text-center">Discover our handcrafted masterpieces, preserved for eternity.</p>
        </motion.div>

        <div className="product-grid">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="product-card glass-panel"
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="product-image-container holographic-border" onClick={() => setQuickViewImage(product)}>
                <img src={product.image} alt={product.name} className="product-image" loading="lazy"/>
                <div className="quick-view">
                  <span>Quick View</span>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                <div className="product-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    className="glass-button add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                    style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="glass-button buy-now-btn glowing-text"
                    onClick={() => {
                      onAddToCart(product);
                      // Cart opens automatically, we'll let the user click checkout for consistency 
                      // or we could trigger a "buy now" event
                    }}
                    style={{ flex: 1, padding: '10px', fontSize: '0.9rem', background: 'var(--soft-gold)', color: 'white' }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {quickViewImage && (
            <motion.div 
              className="quick-view-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewImage(null)}
            >
              <motion.div 
                className="quick-view-modal glass-panel"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal-btn" onClick={() => setQuickViewImage(null)}>
                  <X size={24} />
                </button>
                <img src={quickViewImage.image} alt={quickViewImage.name} className="quick-view-image-large" />
                <div className="quick-view-details">
                  <h3>{quickViewImage.name}</h3>
                  <p className="product-price">₹{quickViewImage.price}</p>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button className="glass-button" onClick={() => onAddToCart(quickViewImage)} style={{ flex: 1 }}>Add to Cart</button>
                    <button className="glass-button glowing-text" style={{ flex: 1, background: 'var(--soft-gold)', color: 'white' }} onClick={() => { onAddToCart(quickViewImage); }}>Buy Now</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
