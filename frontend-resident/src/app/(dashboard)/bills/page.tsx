'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, IndianRupee, CheckCircle, AlertCircle, CreditCard, Clock } from 'lucide-react';
import api from '@/lib/api';

interface Bill {
  id: number;
  month: string;
  total_amount: string;
  paid_amount: string;
  balance_amount: string;
  status: string;
  due_date: string;
}

interface PaymentRecord {
  id: number;
  amount: string;
  status: string;
  description: string;
  receipt_number: string;
  razorpay_payment_id: string;
  created_at: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState({ total_paid: 0, total_transactions: 0 });
  const [paying, setPaying] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [tab, setTab] = useState<'bills' | 'history'>('bills');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchData();
    return () => { document.body.removeChild(script); };
  }, []);

  const fetchData = async () => {
    try {
      const [billsRes, paymentsRes, summaryRes] = await Promise.all([
        api.get('/maintenance/'),
        api.get('/payments/history/'),
        api.get('/payments/summary/'),
      ]);
      setBills(billsRes.data.results || billsRes.data || []);
      setPayments(paymentsRes.data || []);
      setSummary(summaryRes.data || { total_paid: 0, total_transactions: 0 });
    } catch { }
  };

  const handlePayment = async (bill: Bill) => {
    const amount = parseFloat(bill.balance_amount) || parseFloat(bill.total_amount);
    if (amount <= 0) return;

    setPaying(bill.id);
    setPaymentError(null);
    setPaymentSuccess(null);

    try {
      // Create Razorpay order via backend
      const orderRes = await api.post('/payments/create-order/', {
        maintenance_bill_id: bill.id,
        amount: amount,
      });

      const orderData = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Society Management',
        description: orderData.description,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Verify payment on backend
          try {
            const verifyRes = await api.post('/payments/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.status === 'success') {
              setPaymentSuccess(`₹${amount} paid successfully! Receipt: ${orderData.receipt}`);
              fetchData(); // Refresh data
            }
          } catch {
            setPaymentError('Payment verification failed. Please contact support.');
          }
          setPaying(null);
        },
        prefill: orderData.prefill,
        theme: { color: '#10B981' },
        modal: {
          ondismiss: () => setPaying(null),
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          setPaymentError('Payment failed. Please try again.');
          setPaying(null);
        });
        rzp.open();
      } else {
        // Fallback for development — simulate payment
        await simulatePayment(bill, amount, orderData);
      }
    } catch {
      setPaymentError('Failed to create payment order. Please try again.');
      setPaying(null);
    }
  };

  const simulatePayment = async (bill: Bill, amount: number, orderData: any) => {
    // Dev mode: simulate a successful payment
    try {
      const verifyRes = await api.post('/payments/verify/', {
        razorpay_order_id: orderData.order_id,
        razorpay_payment_id: `pay_dev_${Date.now()}`,
        razorpay_signature: 'dev_signature',
      });

      if (verifyRes.data.status === 'success') {
        setPaymentSuccess(`₹${amount} paid successfully! Receipt: ${orderData.receipt}`);
        fetchData();
      }
    } catch {
      setPaymentError('Payment simulation failed.');
    }
    setPaying(null);
  };

  const statusBadge = (s: string) => ({
    paid: 'badge-success',
    unpaid: 'badge-error',
    overdue: 'badge-warning',
    partially_paid: 'badge-info',
  }[s] || 'badge-neutral');

  const unpaidBills = bills.filter(b => b.status !== 'paid');
  const paidBills = bills.filter(b => b.status === 'paid');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B' }}>
          Payments & Bills
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>
          View and pay your maintenance bills
        </p>
      </div>

      {/* Alerts */}
      {paymentSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#D1FAE5', color: '#065F46', padding: '14px 18px', borderRadius: 12, marginBottom: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={20} /> {paymentSuccess}
          <button onClick={() => setPaymentSuccess(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#065F46', fontWeight: 700, fontSize: '1.1rem' }}>×</button>
        </motion.div>
      )}
      {paymentError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#FEE2E2', color: '#991B1B', padding: '14px 18px', borderRadius: 12, marginBottom: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={20} /> {paymentError}
          <button onClick={() => setPaymentError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700, fontSize: '1.1rem' }}>×</button>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Due', value: `₹${unpaidBills.reduce((s, b) => s + parseFloat(b.balance_amount || b.total_amount), 0).toLocaleString()}`, icon: IndianRupee, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Total Paid', value: `₹${summary.total_paid.toLocaleString()}`, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Transactions', value: summary.total_transactions, icon: CreditCard, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Unpaid Bills', value: unpaidBills.length, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: 4, fontFamily: 'Poppins' }}>{card.value}</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={card.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F1F5F9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {(['bills', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              background: tab === t ? '#FFF' : 'transparent', color: tab === t ? '#064E3B' : '#64748B',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s',
            }}>
            {t === 'bills' ? '📄 Bills' : '🧾 Payment History'}
          </button>
        ))}
      </div>

      {tab === 'bills' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bills.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
              <Receipt size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No bills found.
            </div>
          ) : bills.map((bill, i) => (
            <motion.div key={bill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>{bill.month}</h3>
                    <span className={`badge ${statusBadge(bill.status)}`}>{bill.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: '0.8125rem', color: '#64748B' }}>
                    <span>Total: <strong style={{ color: '#0F172A' }}>₹{parseFloat(bill.total_amount).toLocaleString()}</strong></span>
                    <span>Paid: <strong style={{ color: '#10B981' }}>₹{parseFloat(bill.paid_amount).toLocaleString()}</strong></span>
                    <span>Due: <strong style={{ color: '#EF4444' }}>₹{parseFloat(bill.balance_amount).toLocaleString()}</strong></span>
                    <span>Due date: {bill.due_date}</span>
                  </div>
                </div>
                {bill.status !== 'paid' && (
                  <button className="btn-primary" onClick={() => handlePayment(bill)} disabled={paying === bill.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', opacity: paying === bill.id ? 0.7 : 1 }}>
                    <CreditCard size={16} />
                    {paying === bill.id ? 'Processing...' : `Pay ₹${parseFloat(bill.balance_amount || bill.total_amount).toLocaleString()}`}
                  </button>
                )}
                {bill.status === 'paid' && (
                  <span style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={18} /> Paid
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Receipt</th><th>Status</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                  <CreditCard size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No payment history.
                </td></tr>
              ) : payments.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{p.description}</td>
                  <td style={{ color: '#10B981', fontWeight: 600 }}>₹{parseFloat(p.amount).toLocaleString()}</td>
                  <td><span className="badge badge-neutral">{p.receipt_number}</span></td>
                  <td><span className={`badge ${p.status === 'captured' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
