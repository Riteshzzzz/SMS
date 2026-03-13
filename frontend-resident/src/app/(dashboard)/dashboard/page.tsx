'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, MessageSquare, Dumbbell, Bell, Users, IndianRupee, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ResidentDashboard() {
  const [stats, setStats] = useState({
    dueAmount: 0,
    openComplaints: 0,
    upcomingBookings: 0,
    newNotices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<any[]>([]);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchDashboardData();
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [billsRes, complaintsRes, bookingsRes, noticesRes] = await Promise.all([
        api.get('/maintenance/'),
        api.get('/complaints/'),
        api.get('/amenity-bookings/my_bookings/'),
        api.get('/notices/'),
      ]);

      const bills = billsRes.data.results || billsRes.data || [];
      const dueAmount = bills.reduce((sum: number, b: any) => sum + parseFloat(b.balance_amount || 0), 0);
      
      const complaints = complaintsRes.data.results || complaintsRes.data || [];
      const openComplaints = complaints.filter((c: any) => c.status !== 'resolved').length;

      const bookings = bookingsRes.data || [];
      const upcomingBookings = bookings.filter((b: any) => b.booking_status === 'approved' || b.booking_status === 'pending').length;

      const items = noticesRes.data.results || noticesRes.data || [];
      setNotices(items.slice(0, 3));

      setStats({
        dueAmount,
        openComplaints,
        upcomingBookings,
        newNotices: items.length,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPay = async () => {
    if (stats.dueAmount <= 0) return;
    
    // Find the first unpaid bill to pay
    try {
      const billsRes = await api.get('/maintenance/');
      const bills = billsRes.data.results || billsRes.data || [];
      const billToPay = bills.find((b: any) => b.status !== 'paid');
      
      if (!billToPay) return;

      setPaying(true);
      setMessage(null);

      const orderRes = await api.post('/payments/create-order/', {
        maintenance_bill_id: billToPay.id,
        amount: stats.dueAmount,
      });

      const orderData = orderRes.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Society Management',
        description: `Full Dues Payment - ${billToPay.month}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post('/payments/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.status === 'success') {
              setMessage({ type: 'success', text: 'Payment successful! Dashboard updated.' });
              fetchDashboardData();
            }
          } catch {
            setMessage({ type: 'error', text: 'Verification failed. Contact admin.' });
          }
          setPaying(false);
        },
        prefill: orderData.prefill,
        theme: { color: '#064E3B' },
        modal: { ondismiss: () => setPaying(false) },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for simulation
        const verifyRes = await api.post('/payments/verify/', {
          razorpay_order_id: orderData.order_id,
          razorpay_payment_id: `pay_dev_${Date.now()}`,
          razorpay_signature: 'dev_signature',
        });
        if (verifyRes.data.status === 'success') {
          setMessage({ type: 'success', text: 'Payment successful (Simulated)!' });
          fetchDashboardData();
        }
        setPaying(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to initiate payment.' });
      setPaying(false);
    }
  };

  const dashboardCards = [
    { label: 'Due Amount', value: `₹${stats.dueAmount.toLocaleString()}`, icon: IndianRupee, color: '#EF4444', bg: '#FEF2F2', action: stats.dueAmount > 0 },
    { label: 'Open Complaints', value: stats.openComplaints.toString(), icon: MessageSquare, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Upcoming Bookings', value: stats.upcomingBookings.toString(), icon: Dumbbell, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'New Notices', value: stats.newNotices.toString(), icon: Bell, color: '#2563EB', bg: '#EFF6FF' },
  ];

  const quickActions = [
    { label: 'View Bills', icon: Receipt, href: '/bills', color: '#10B981', bg: '#ECFDF5' },
    { label: 'File Complaint', icon: MessageSquare, href: '/complaints', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Book Amenity', icon: Dumbbell, href: '/amenities', color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Pre-approve Visitor', icon: Users, href: '/visitors', color: '#2563EB', bg: '#EFF6FF' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B' }}>Welcome Home 🏠</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Here&apos;s your society at a glance.</p>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: message.type === 'success' ? '#065F46' : '#991B1B',
            padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </motion.div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {dashboardCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4, fontFamily: 'Poppins' }}>
                    {loading ? '...' : card.value}
                  </p>
                  {card.action && (
                    <button 
                      onClick={handleQuickPay}
                      disabled={paying}
                      style={{
                        marginTop: 12, padding: '6px 12px', borderRadius: 8, background: '#EF4444', color: 'white',
                        border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <CreditCard size={12} /> {paying ? 'Wait...' : 'Pay Now'}
                    </button>
                  )}
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={card.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'Poppins', fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, color: '#064E3B' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={26} color={action.color} />
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{action.label}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Recent Notices */}
      <h2 style={{ fontFamily: 'Poppins', fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, color: '#064E3B' }}>Recent Notices</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
           <div className="glass-card" style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="glass-card" style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No recent notices.</div>
        ) : notices.map((notice, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="glass-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className={`badge ${notice.priority === 'high' ? 'badge-error' : notice.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{notice.priority}</span>
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{notice.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: 4, lineHeight: 1.5 }}>{notice.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
