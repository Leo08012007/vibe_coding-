import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, Lock } from 'lucide-react';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import './CustomOrders.css';

export default function CustomOrders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', idea: '' });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus('Sending Request...');
    
    try {
      let imageUrl = '';
      
      if (file && storage) {
        setUploadStatus('Uploading Image...');
        const imageRef = ref(storage, `custom_orders/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
      }
      
      setUploadStatus('Saving Details...');
      
      if (db) {
        await addDoc(collection(db, 'custom_orders'), {
          ...formState,
          userId: currentUser.uid,
          imageUrl,
          createdAt: serverTimestamp()
        });
      }
      
      setUploadStatus('Notifying Team...');
      
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_name: 'Brindha',
            from_name: formState.name,
            to_email: formState.email, // Passing user email
            phone: formState.phone,
            message: formState.idea,
            image_url: imageUrl || 'No image provided'
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error("Failed to send notification email: ", emailError);
      }
      
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', idea: '' });
      setFile(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <section id="custom-orders" className="section custom-orders-section">
      <div className="container custom-orders-container">
        <motion.div 
          className="order-text glass-panel"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-luxury">Bring Your Vision to Life</h2>
          <p className="order-description">
            Looking for something uniquely yours? We specialize in preserving your most precious memories—wedding garlands, baby keepsakes, and personalized resin art crafted just for you.
          </p>
          <div className="process-steps">
            <div className="step">
              <span className="step-num">01</span>
              <h4>Share Your Idea</h4>
              <p>Tell us what you want to create or preserve.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h4>Design & Craft</h4>
              <p>We work magic with resin, flowers, and love.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h4>Cherish Forever</h4>
              <p>Receive your timeless piece of art.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="order-form-container glass-panel holographic-border"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {submitted ? (
            <motion.div 
              className="success-message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="heading-luxury">Request Received!</h3>
              <p>We're sprinkling some magic on your idea and will reach out to you shortly.</p>
            </motion.div>
          ) : !currentUser ? (
            <div className="login-required-message" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Lock size={48} color="var(--soft-gold)" style={{ marginBottom: '20px' }} />
              <h3 className="heading-luxury">Login Required</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Please create an account or sign in to submit a custom resin request. This helps us track your orders and stay in touch.
              </p>
              <button className="glass-button" onClick={() => navigate('/login')}>Sign In to Continue</button>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <h3>Custom Order Request</h3>
              
              <div className="input-group">
                <input type="text" required placeholder=" " value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} disabled={isSubmitting} />
                <label>Your Name</label>
              </div>
              
              <div className="input-group">
                <input type="email" required placeholder=" " value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} disabled={isSubmitting} />
                <label>Your Email</label>
              </div>

              <div className="input-group">
                <input type="tel" required placeholder=" " value={formState.phone} onChange={(e) => setFormState({...formState, phone: e.target.value})} disabled={isSubmitting} />
                <label>Your Phone Number</label>
              </div>
              
              <div className="input-group">
                <textarea required placeholder=" " rows="4" value={formState.idea} onChange={(e) => setFormState({...formState, idea: e.target.value})} disabled={isSubmitting}></textarea>
                <label>Tell us your idea...</label>
              </div>

              <div className="upload-btn-wrapper">
                <button type="button" className="glass-button upload-btn" disabled={isSubmitting}>
                  <Upload size={18} /> {file ? file.name : 'Upload Reference Image'}
                </button>
                <input type="file" name="myfile" disabled={isSubmitting} onChange={handleFileChange} accept="image/*" />
              </div>

              <button type="submit" className="glass-button submit-btn glowing-text" disabled={isSubmitting}>
                {isSubmitting ? uploadStatus : 'Send Request'} <Send size={18} style={{ marginLeft: '10px' }}/>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

