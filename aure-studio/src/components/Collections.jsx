import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ShoppingCart, Zap } from 'lucide-react';
import './Collections.css';

const products = [
  { id: 1, name: 'Floral Resin Coaster', price: 499, image: '/products/product_1.png', category: 'Handcrafted' },
  { id: 2, name: 'Custom Name Keychain', price: 299, image: '/products/product_2.png', category: 'Personalized' },
  { id: 3, name: 'Premium Resin Bookmark', price: 249, image: '/products/product_3.png', category: 'Handcrafted' },
  { id: 4, name: 'Ocean Resin Tray', price: 1499, image: '/products/product_4.png', category: 'Luxury Decor' },
  { id: 5, name: 'Resin Jewelry Set', price: 899, image: '/products/product_5.png', category: 'Accessories' },
  { id: 6, name: 'Couple Memory Frame', price: 1999, image: '/products/product_6.png', category: 'Personalized' },
  { id: 7, name: 'Luxury Resin Clock', price: 2499, image: '/products/product_7.png', category: 'Home Decor' },
  { id: 8, name: 'Rose Keepsake Block', price: 1299, image: '/products/product_8.png', category: 'Preserved' },
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
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="section-header"
          style={{ marginBottom: '80px' }}
        >
          <h2 className="heading-luxury text-center" style={{ fontSize: '3.5rem' }}>The Masterpieces</h2>
          <p className="subtitle text-center" style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '20px auto' }}>
            Each piece is a singular expression of beauty, preserved in crystal clear resin for eternity.
          </p>
        </motion.div>

        <div className="product-grid">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="product-card glass-panel"
            >
              <div className="product-image-container holographic-border">
                <motion.img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image" 
                  loading="lazy"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="product-overlay">
                  <button className="quick-view-btn" onClick={() => setQuickViewImage(product)}>
                    <Eye size={20} />
                    <span>View Details</span>
                  </button>
                </div>
                <div className="product-category-badge">{product.category}</div>
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                  <p className="product-price">₹{product.price}</p>
                  <span className="stock-status">Available</span>
                </div>
                
                <div className="product-actions">
                  <button 
                    className="glass-button add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button 
                    className="glass-button buy-now-btn glowing-text"
                    onClick={() => {
                      onAddToCart(product);
                    }}
                  >
                    <Zap size={18} />
                    <span>Buy Now</span>
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
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal-btn" onClick={() => setQuickViewImage(null)}>
                  <X size={28} />
                </button>
                
                <div className="modal-content-split">
                  <div className="modal-image-wrapper">
                    <img src={quickViewImage.image} alt={quickViewImage.name} className="quick-view-image-large" />
                  </div>
                  <div className="quick-view-details">
                    <span className="modal-category">{quickViewImage.category}</span>
                    <h3 className="heading-luxury" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{quickViewImage.name}</h3>
                    <p className="product-price" style={{ fontSize: '1.8rem', color: 'var(--soft-gold)', marginBottom: '30px' }}>₹{quickViewImage.price}</p>
                    
                    <p className="product-description" style={{ color: 'white', lineHeight: '1.8', marginBottom: '40px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      Meticulously handcrafted using high-grade, UV-resistant resin. This piece features delicate elements suspended in time, creating a 3D depth that captivates from every angle.
                    </p>
                    
                    <div className="modal-actions">
                      <button className="glass-button large" onClick={() => onAddToCart(quickViewImage)}>
                        Add to Cart
                      </button>
                      <button className="glass-button large buy-now-btn" onClick={() => { onAddToCart(quickViewImage); }}>
                        Buy Now
                      </button>
                    </div>
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

