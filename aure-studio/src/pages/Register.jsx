import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, CheckCircle, Sparkles } from 'lucide-react';
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
      const emailParams = {
        name: name || 'Valued Customer',
        email: email,
        from_name: "Brindha's Resin Studio",
        message: "Welcome to Brindha's Resin Studio! We are thrilled to have you join our community of handcrafted art lovers. Your account has been successfully initialized."
      };

      console.log('--- EmailJS Debug Info ---');
      console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
      console.log('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
      console.log('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      console.log('Params:', emailParams);

      try {
        const response = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Email successfully sent!', response.status, response.text);
        toast.success('Welcome email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        toast.warning('Account created, but welcome email failed to send.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      toast.error('Registration failed: ' + error.message);
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
        style={{ padding: '60px', maxWidth: '480px', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                style={{ background: 'var(--soft-gold)', padding: '20px', borderRadius: '50%', color: 'white' }}
              >
                <CheckCircle size={60} />
              </motion.div>
              
              <div style={{ position: 'relative' }}>
                <h3 className="heading-luxury" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome, {name.split(' ')[0]}!</h3>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ position: 'absolute', top: '-20px', right: '-20px' }}
                >
                  <Sparkles color="var(--soft-gold)" size={24} />
                </motion.div>
              </div>
              
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Your journey into handcrafted elegance begins now. Redirecting you to the gallery...
              </p>
              
              <motion.div 
                style={{ width: '100%', height: '4px', background: 'rgba(212, 175, 55, 0.2)', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.5, ease: 'linear' }}
                  style={{ height: '100%', background: 'var(--soft-gold)' }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="heading-luxury" style={{ fontSize: '2.8rem', marginBottom: '15px' }}>Join Brindha's</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '45px', letterSpacing: '1px' }}>Create an account to preserve your memories.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div className="input-group" style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '18px', left: '20px', color: 'var(--soft-gold)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                  />
                </div>
                
                <div className="input-group" style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '18px', left: '20px', color: 'var(--soft-gold)' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                  />
                </div>
                
                <div className="input-group" style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', top: '18px', left: '20px', color: 'var(--soft-gold)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Create Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                  />
                </div>
                
                <button type="submit" disabled={loading} className="glass-button glowing-text" style={{ marginTop: '15px', padding: '18px', fontSize: '1.1rem', background: 'var(--soft-gold)', color: 'white' }}>
                  {loading ? 'Crafting Account...' : 'Initialize Journey'}
                </button>
              </form>

              <div style={{ marginTop: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '25px' }}>
                <p style={{ color: 'var(--text-light)' }}>
                  Part of the family? <Link to="/login" style={{ color: 'var(--soft-gold)', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Sign In</Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}


