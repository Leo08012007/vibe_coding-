import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: payment, 2: success

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.info('Please log in to proceed to checkout.');
      closeCart();
      navigate('/login');
      return;
    }

    setCheckoutStep(1); // Show processing

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setCheckoutStep(0);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: total * 100, // paise
      currency: "INR",
      name: "Brindha's Resin Studio",
      description: "Premium Resin Art Order",
      handler: async function (response) {
        try {
          if (db) {
            await addDoc(collection(db, 'orders'), {
              userId: currentUser.uid,
              userEmail: currentUser.email,
              items: cartItems,
              total: total,
              paymentId: response.razorpay_payment_id,
              status: 'paid',
              createdAt: serverTimestamp()
            });
          }
          setCheckoutStep(2);
          clearCart();
        } catch (err) {
          console.error("Error saving order: ", err);
          toast.error("Payment successful but failed to save order. Contact support.");
          setCheckoutStep(0);
        }
      },
      prefill: {
        name: currentUser.displayName || "",
        email: currentUser.email || "",
      },
      theme: {
        color: "#c0a062" 
      }
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response) {
      toast.error('Payment failed: ' + response.error.description);
      setCheckoutStep(0);
    });

    paymentObject.open();
  };

  const closeCart = () => {
    setCheckoutStep(0);
    setCartOpen(false);
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
            className="cart-sidebar glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <h3>{checkoutStep === 2 ? 'Order Success' : 'Your Cart'}</h3>
              <button className="close-cart-btn" onClick={closeCart}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-body">
              {checkoutStep === 0 && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="empty-cart">
                      <p>Your cart is empty.</p>
                      <button className="glass-button" onClick={closeCart}>Continue Shopping</button>
                    </div>
                  ) : (
                    <div className="cart-items">
                      <AnimatePresence>
                        {cartItems.map((item, idx) => (
                          <motion.div 
                            key={`${item.id}-${idx}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            className="cart-item"
                          >
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                              <h4>{item.name}</h4>
                              <p>₹{item.price}</p>
                            </div>
                            <button className="remove-item-btn" onClick={() => removeFromCart(idx)}>
                              <Trash2 size={18} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 1 && (
                <div className="checkout-processing">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <CreditCard size={40} color="var(--soft-gold)" />
                  </motion.div>
                  <p>Processing Payment securely...</p>
                  <div className="payment-methods">
                    <span>UPI</span> • <span>GPay</span> • <span>Cards</span>
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <motion.div 
                  className="checkout-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="sparkles-container">✨ 🎉 ✨</div>
                  <h3>Order Placed Successfully!</h3>
                  <p>Thank you for choosing Brindha's Resin Studio. We will begin crafting your masterpiece soon.</p>
                  <button className="glass-button success-btn" onClick={closeCart}>
                    Close
                  </button>
                </motion.div>
              )}
            </div>

            {cartItems.length > 0 && checkoutStep === 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>
                {!currentUser && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--soft-gold)', marginBottom: '10px', textAlign: 'center' }}>
                    Login required for secure checkout
                  </p>
                )}
                <button className="glass-button checkout-btn glowing-text" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

