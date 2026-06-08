import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Sparkles, LogIn } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      // Send Welcome Back Email
      const emailParams = {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        from_name: "Brindha's Resin Studio",
        message: "Welcome back to Brindha's Resin Studio! We missed you. Dive back into our latest handcrafted collections."
      };

      console.log('--- EmailJS Login Debug ---');
      console.log('Params:', emailParams);

      try {
        const response = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Login Welcome-back email sent!', response.status, response.text);
      } catch (err) {
        console.error('Email failed', err);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      toast.error('Authentication failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '60px', maxWidth: '480px', width: '100%', textAlign: 'center' }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Sparkles size={60} color="var(--soft-gold)" />
              </motion.div>
              <h2 className="heading-luxury" style={{ fontSize: '2.5rem' }}>Authenticated</h2>
              <p style={{ color: 'var(--text-light)' }}>Welcome back to the studio.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="heading-luxury" style={{ fontSize: '2.8rem', marginBottom: '15px' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '45px', letterSpacing: '1px' }}>Sign in to continue your art journey.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '18px', left: '20px', color: 'var(--soft-gold)' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', top: '18px', left: '20px', color: 'var(--soft-gold)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                
                <button type="submit" disabled={loading} className="glass-button glowing-text" style={{ marginTop: '15px', padding: '18px', fontSize: '1.1rem', background: 'var(--soft-gold)', color: 'white' }}>
                  {loading ? 'Authenticating...' : 'Enter Studio'}
                </button>
              </form>

              <div style={{ marginTop: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '25px' }}>
                <p style={{ color: 'var(--text-light)' }}>
                  New to Brindha's? <Link to="/register" style={{ color: 'var(--soft-gold)', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Create Account</Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

