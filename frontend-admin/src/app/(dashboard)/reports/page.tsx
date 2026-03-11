'use client';
import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ReportsPage() {
  const [financial, setFinancial] = useState<any>(null);
  const [complaintData, setComplaintData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reports/financial-summary/').then(r => setFinancial(r.data)).catch(() => {});
    api.get('/reports/complaint-analytics/').then(r => setComplaintData(r.data.by_category || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Reports & Analytics</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Comprehensive society analytics</p>

      {financial ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Billed', value: `₹${financial.total_billed || 0}`, color: '#2563EB' },
            { label: 'Collected', value: `₹${financial.total_collected || 0}`, color: '#10B981' },
            { label: 'Outstanding', value: `₹${financial.total_outstanding || 0}`, color: '#EF4444' },
            { label: 'Total Bills', value: financial.bill_count || 0, color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>{s.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: 'Poppins, sans-serif', marginTop: 4 }}>{s.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8', marginBottom: 24 }}>
          <BarChart3 size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
          No data available yet. Reports will appear once data is populated.
        </div>
      )}

      {complaintData.length > 0 && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, marginBottom: 16 }}>Complaint Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={complaintData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="count" nameKey="category" label>
                {complaintData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
