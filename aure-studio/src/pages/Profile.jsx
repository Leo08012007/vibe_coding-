import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, User, ShoppingBag, PenTool, Settings, LogOut, Clock, ExternalLink } from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        // Fetch Regular Orders
        const ordersQ = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
        const ordersSnapshot = await getDocs(ordersQ);
        const fetchedOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));

        // Fetch Custom Requests
        const customQ = query(collection(db, "custom_orders"), where("userId", "==", currentUser.uid));
        const customSnapshot = await getDocs(customQ);
        const fetchedCustom = customSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomRequests(fetchedCustom.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));

      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!currentUser) return null;

  return (
    <section className="section" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Profile Header */}
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ padding: '40px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--soft-gold), #e0c68d)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(192, 160, 98, 0.2)' }}>
              <User size={40} color="white" />
            </div>
            <div>
              <h2 className="heading-luxury" style={{ fontSize: '2rem', marginBottom: '5px' }}>{currentUser.displayName || 'Collector'}</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>{currentUser.email}</p>
            </div>
          </div>
          
          <button className="glass-button" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 25px' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </motion.div>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
          {/* Sidebar Navigation */}
          <motion.div 
            className="dashboard-nav glass-panel"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ padding: '30px', height: 'fit-content' }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => setActiveTab('orders')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'orders' ? 'rgba(192, 160, 98, 0.1)' : 'transparent',
                  color: activeTab === 'orders' ? 'var(--soft-gold)' : 'var(--text-dark)',
                  fontWeight: activeTab === 'orders' ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                <ShoppingBag size={20} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('custom')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'custom' ? 'rgba(192, 160, 98, 0.1)' : 'transparent',
                  color: activeTab === 'custom' ? 'var(--soft-gold)' : 'var(--text-dark)',
                  fontWeight: activeTab === 'custom' ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                <PenTool size={20} /> Custom Requests
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'settings' ? 'rgba(192, 160, 98, 0.1)' : 'transparent',
                  color: activeTab === 'settings' ? 'var(--soft-gold)' : 'var(--text-dark)',
                  fontWeight: activeTab === 'settings' ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                <Settings size={20} /> Settings
              </button>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            className="dashboard-content glass-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ padding: '40px' }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                  <ShoppingBag size={40} color="var(--soft-gold)" />
                </motion.div>
                <p style={{ marginTop: '20px', color: 'var(--text-light)' }}>Fetching your treasures...</p>
              </div>
            ) : (
              <>
                {activeTab === 'orders' && (
                  <div className="tab-content">
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Order History</h3>
                    {orders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>No purchases yet. Your first resin masterpiece awaits!</p>
                        <button className="glass-button" onClick={() => navigate('/')}>Browse Collections</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {orders.map(order => (
                          <div key={order.id} style={{ background: 'rgba(255,255,255,0.3)', padding: '25px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                              <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)' }}>Order ID: #{order.id.substring(0, 8)}</span>
                                <h4 style={{ margin: '5px 0', fontSize: '1.2rem' }}>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                  <Clock size={14} /> {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--soft-gold)' }}>₹{order.total}</div>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>Paid</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                              {order.items.map((item, i) => (
                                <img key={i} src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                              ))}
                            </div>
                            {order.paymentId && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
                                Payment Ref: {order.paymentId}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="tab-content">
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Custom Resin Requests</h3>
                    {customRequests.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Have a special vision? Start your first custom order.</p>
                        <button className="glass-button" onClick={() => navigate('/')}>Create Custom Art</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {customRequests.map(request => (
                          <div key={request.id} style={{ background: 'rgba(255,255,255,0.3)', padding: '25px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                              {request.imageUrl && (
                                <img src={request.imageUrl} alt="Reference" style={{ width: '100px', height: '100px', borderRadius: '15px', objectFit: 'cover' }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Vision: {request.idea.substring(0, 30)}...</h4>
                                  <span style={{ fontSize: '0.8rem', background: 'rgba(192, 160, 98, 0.1)', color: 'var(--soft-gold)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>Reviewing</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '15px', fontStyle: 'italic' }}>"{request.idea}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {new Date(request.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                  {request.imageUrl && <a href={request.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--soft-gold)', textDecoration: 'none' }}><ExternalLink size={14} /> View Reference</a>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="tab-content" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Settings size={48} color="var(--soft-gold)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Account Settings</h3>
                    <p style={{ color: 'var(--text-light)' }}>Profile customization features coming soon to your studio.</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template_columns: 1fr !important;
          }
          .dashboard-nav {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </section>
  );
}
