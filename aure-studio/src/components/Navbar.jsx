import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const { cartItems, setCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinks = ['Home', 'Collections', 'Custom Orders', 'About', 'Reviews', 'Contact'];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`navbar ${scrolled ? 'glass-nav scrolled' : ''}`}
      >
        <div className="nav-container container">
          <Link to="/" className="nav-brand">
            <span className="brand-primary">Brindha's</span>
            <span className="brand-secondary">Resin Studio</span>
          </Link>
          
          <div className="nav-links desktop-only">
            {navLinks.map((link) => (
              <a key={link} href={`/#${link.toLowerCase().replace(' ', '-')}`} className="nav-link">
                {link}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <User size={20} />
                  <span className="desktop-only" style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="glass-button" style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap' }}>Sign Out</button>
              </div>
            ) : (
              <Link to="/login" className="glass-button" style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Sign In</Link>
            )}

            <button className="cart-btn" onClick={() => setCartOpen(true)} style={{ marginLeft: '15px' }}>
              <ShoppingBag size={20} />
              <span className="cart-badge">{cartItems.length}</span>
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-menu glass-panel"
          >
            <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <a 
                  key={link} 
                  href={`/#${link.toLowerCase().replace(' ', '-')}`} 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {currentUser ? (
                  <>
                    <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="glass-button">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="glass-button" style={{ textAlign: 'center', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

