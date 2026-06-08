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
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'collections', 'custom-orders', 'about', 'reviews', 'contact'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="nav-container container">
          <Link to="/" className="nav-brand">
            <span className="brand-primary">Brindha's</span>
            <span className="brand-secondary">Resin Studio</span>
          </Link>
          
          <div className="nav-links desktop-only">
            {navLinks.map((link) => {
              const sectionId = link.toLowerCase().replace(' ', '-');
              return (
                <a 
                  key={link} 
                  href={`/#${sectionId}`} 
                  className={`nav-link ${activeSection === sectionId ? 'active' : ''}`}
                >
                  {link}
                </a>
              );
            })}
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <div className="user-profile-nav">
                <Link to="/profile" className="nav-link profile-link">
                  <User size={18} />
                  <span className="desktop-only user-name">
                    {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="glass-button" style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>Sign In</Link>
            )}

            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="cart-badge"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
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
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="mobile-menu glass-panel"
            style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100vh', zIndex: 2000, padding: '40px' }}
          >
            <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none' }}>
              <X size={36} />
            </button>
            <div className="mobile-nav-links" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' }}>
              {navLinks.map((link) => {
                const sectionId = link.toLowerCase().replace(' ', '-');
                return (
                  <a 
                    key={link} 
                    href={`/#${sectionId}`} 
                    className={`mobile-nav-link ${activeSection === sectionId ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: '2.5rem', fontWeight: '700', textDecoration: 'none', color: activeSection === sectionId ? 'var(--soft-gold)' : 'var(--text-dark)' }}
                  >
                    {link}
                  </a>
                );
              })}
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentUser ? (
                  <>
                    <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem' }}>Profile</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="glass-button" style={{ fontSize: '1.2rem' }}>Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="glass-button" style={{ textAlign: 'center', textDecoration: 'none', fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


