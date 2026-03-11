'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, IndianRupee } from 'lucide-react';
import api from '@/lib/api';

interface Bill {
  id: number;
  flat: number;
  month: string;
  total_amount: string;
  paid_amount: string;
  balance_amount: string;
  status: string;
  due_date: string;
}

export default function MaintenancePage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/maintenance/').then(res => setBills(res.data.results || res.data || [])).catch(() => {});
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { paid: 'badge-success', unpaid: 'badge-error', overdue: 'badge-warning', partially_paid: 'badge-info' };
    return map[status] || 'badge-neutral';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
            Maintenance Billing
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Track and manage maintenance bills</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Billed', value: '₹4,20,000', color: '#2563EB' },
          { label: 'Collected', value: '₹3,60,000', color: '#10B981' },
          { label: 'Outstanding', value: '₹60,000', color: '#EF4444' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: 'Poppins, sans-serif', marginTop: 4 }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 400 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input className="input-field" style={{ paddingLeft: 40 }} placeholder="Search bills..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Flat</th><th>Month</th><th>Total</th><th>Paid</th><th>Balance</th><th>Due Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                <Receipt size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                No bills found.
              </td></tr>
            ) : bills.map(bill => (
              <tr key={bill.id}>
                <td style={{ fontWeight: 600 }}>Flat #{bill.flat}</td>
                <td>{bill.month}</td>
                <td><IndianRupee size={12} style={{ display: 'inline' }} />{bill.total_amount}</td>
                <td style={{ color: '#10B981' }}><IndianRupee size={12} style={{ display: 'inline' }} />{bill.paid_amount}</td>
                <td style={{ color: '#EF4444' }}><IndianRupee size={12} style={{ display: 'inline' }} />{bill.balance_amount}</td>
                <td>{bill.due_date}</td>
                <td><span className={`badge ${statusBadge(bill.status)}`}>{bill.status.replace('_', ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
