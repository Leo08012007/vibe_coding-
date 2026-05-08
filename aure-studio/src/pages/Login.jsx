import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log in: ' + error.message);
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
        <h2 className="heading-luxury" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '40px' }}>Sign in to continue your journey with Brindha's Resin Studio.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '30px', color: 'var(--text-light)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--soft-gold)', fontWeight: 'bold', textDecoration: 'none' }}>Register Here</Link>
        </p>
      </motion.div>
    </section>
  );
}
