import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CreditCard, Minus, Plus, ShoppingBag, CheckCircle, Star, QrCode, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart, clearCart, updateQuantity, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: UPI QR, 2: Verifying, 3: Success
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = () => {
    if (!currentUser) {
      toast.info('Please log in to proceed to checkout.');
      closeCart();
      navigate('/login');
      return;
    }
    setCheckoutStep(1);
  };

  const handleDonePayment = async () => {
    setCheckoutStep(2); // Show "Verifying..."
    
    // Simulate verification delay
    setTimeout(async () => {
      try {
        if (db) {
          const docRef = await addDoc(collection(db, 'orders'), {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            userName: currentUser.displayName || 'Guest',
            items: cartItems,
            total: cartTotal,
            status: 'manual payment pending verification',
            paymentMethod: 'UPI QR',
            createdAt: serverTimestamp()
          });
          setOrderId(docRef.id);
        }
        setCheckoutStep(3);
        clearCart();
      } catch (err) {
        console.error("Error saving order: ", err);
        toast.error("Failed to save order. Contact support.");
        setCheckoutStep(0);
      }
    }, 3500);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.warn("Please select a star rating");
      return;
    }
    setIsSubmittingReview(true);
    try {
      // Simulate review submission or update order doc
      toast.success("Thank you for your feedback!");
      closeCart();
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const closeCart = () => {
    setCheckoutStep(0);
    setCartOpen(false);
    setRating(0);
    setReview('');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div 
            className={`cart-sidebar glass-panel ${checkoutStep > 0 ? 'wide' : ''}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={24} color="var(--soft-gold)" />
                <h3 className="heading-luxury" style={{ fontSize: '1.5rem', letterSpacing: '2px' }}>
                  {checkoutStep === 3 ? 'Thank You' : checkoutStep === 1 ? 'Payment' : 'Your Gallery'}
                </h3>
              </div>
              <button className="close-cart-btn" onClick={closeCart}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-body">
              {checkoutStep === 0 && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="empty-cart">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <ShoppingBag size={64} color="var(--pastel-lavender)" style={{ marginBottom: '20px' }} />
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Your art gallery is empty.</p>
                        <button className="glass-button" style={{ marginTop: '20px' }} onClick={closeCart}>
                          Start Exploring
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="cart-items">
                      <AnimatePresence>
                        {cartItems.map((item) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="cart-product-card glass-panel"
                          >
                            <div className="cart-item-image-container">
                              <img src={item.image} alt={item.name} className="cart-item-image-premium" />
                            </div>
                            
                            <div className="cart-item-info">
                              <div className="cart-item-header">
                                <h4 className="cart-item-title">{item.name}</h4>
                                <button className="remove-btn-minimal" onClick={() => removeFromCart(item.id)}>
                                  <X size={16} />
                                </button>
                              </div>
                              
                              <p className="cart-item-price-gold">₹{item.price}</p>
                              
                              <div className="premium-quantity-selector">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="qty-circle-btn" 
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus size={14} />
                                </motion.button>
                                
                                <span className="qty-value">{item.quantity}</span>
                                
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="qty-circle-btn" 
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 1 && (
                <motion.div 
                  className="upi-payment-screen"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="upi-card glass-panel">
                    <div className="upi-header">
                      <h3 className="heading-luxury">Secure Payment</h3>
                      <p className="upi-brand">Tailuru Mokshitha</p>
                      <p className="upi-id-badge">7093833189@fam</p>
                    </div>

                    <div className="qr-wrapper">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=7093833189@fam&pn=Tailuru%20Mokshitha&am=${cartTotal}&cu=INR`} 
                        alt="UPI QR Code" 
                        className="upi-qr-image-premium" 
                      />
                      <div className="qr-corner top-left"></div>
                      <div className="qr-corner top-right"></div>
                      <div className="qr-corner bottom-left"></div>
                      <div className="qr-corner bottom-right"></div>
                    </div>

                    <div className="payment-summary">
                      <span className="summary-label">Total Amount</span>
                      <h2 className="summary-amount">₹{cartTotal}</h2>
                    </div>

                    <div className="scan-pill">
                      <QrCode size={18} />
                      <span>Scan with any UPI App</span>
                    </div>

                    <button className="glass-button gold-pill large-cta" onClick={handleDonePayment}>
                      I have completed the payment
                    </button>
                    
                    <button className="cancel-link" onClick={() => setCheckoutStep(0)}>
                      Go back to gallery
                    </button>
                  </div>
                </motion.div>
              )}

              {checkoutStep === 2 && (
                <div className="checkout-processing">
                  <div className="loader-container">
                    <motion.div 
                      className="loader-ring"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <CreditCard size={40} className="loader-icon" />
                  </div>
                  <h3 className="processing-title">Verifying Transaction</h3>
                  <p className="processing-sub">Syncing with your bank node...</p>
                </div>
              )}

              {checkoutStep === 3 && (
                <motion.div 
                  className="success-container"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="success-card glass-panel">
                    <div className="success-animation">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                        className="check-circle-premium"
                      >
                        <CheckCircle size={100} color="#4bb543" />
                      </motion.div>
                      <div className="confetti-effect"></div>
                    </div>

                    <h2 className="heading-luxury success-title">ORDER RECEIVED</h2>
                    <p className="success-msg">Thank you for your purchase. Your art is being prepared.</p>

                    <div className="feedback-card">
                      <h4 className="feedback-title">How was your experience?</h4>
                      <div className="star-rating-luxury">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setRating(s)}
                            className={rating >= s ? "star-btn active" : "star-btn"}
                          >
                            <Star fill={rating >= s ? "var(--soft-gold)" : "none"} size={28} />
                          </motion.button>
                        ))}
                      </div>
                      <textarea 
                        placeholder="Share your thoughts..." 
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="review-textarea-premium"
                      />
                      <button 
                        className="glass-button gold-pill submit-review-btn" 
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {cartItems.length > 0 && checkoutStep === 0 && (
              <div className="cart-footer glass-panel">
                <div className="cart-total">
                  <span>Subtotal</span>
                  <motion.span 
                    key={cartTotal}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="total-price"
                  >
                    ₹{cartTotal}
                  </motion.span>
                </div>
                {!currentUser && (
                  <p className="login-hint">* Log in required for secure checkout</p>
                )}
                <button 
                  className="glass-button checkout-btn gold-pill" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


