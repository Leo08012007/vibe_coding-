import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signup(email, password, name);
      
      // Send Welcome Email using EmailJS
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_name: name || 'Valued Customer',
            to_email: email,
            message: 'Thank you for registering at Brindha\'s Resin Studio! We are excited to have you.'
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Failed to register: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ padding: '50px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 0' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle size={80} color="var(--soft-gold)" />
              </motion.div>
              <h3 className="heading-luxury" style={{ fontSize: '2rem' }}>Welcome to Brindha's!</h3>
              <p style={{ color: 'var(--text-light)' }}>Your premium account is ready.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="heading-luxury" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Create Account</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '40px' }}>Join us to preserve your beautiful memories.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-light)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', color: 'var(--text-dark)' }}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-light)' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', color: 'var(--text-dark)' }}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-light)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', color: 'var(--text-dark)' }}
                  />
                </div>
                
                <button type="submit" disabled={loading} className="glass-button glowing-text" style={{ marginTop: '10px', padding: '15px' }}>
                  {loading ? 'Creating...' : 'Sign Up'}
                </button>
              </form>

              <p style={{ marginTop: '30px', color: 'var(--text-light)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--soft-gold)', fontWeight: 'bold', textDecoration: 'none' }}>Login Here</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

