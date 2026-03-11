'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserMinus, AlertTriangle, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function GateDashboard() {
  const [insideCount, setInsideCount] = useState(0);
  const [preApprovedCount, setPreApprovedCount] = useState(0);

  useEffect(() => {
    api.get('/visitors/currently_inside/').then(r => setInsideCount((r.data.results || r.data || []).length)).catch(() => {});
    api.get('/visitors/pre_approved/').then(r => setPreApprovedCount((r.data.results || r.data || []).length)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Currently Inside', value: insideCount, icon: Users, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Pre-approved', value: preApprovedCount, icon: UserPlus, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Checked Out Today', value: 18, icon: UserMinus, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Incidents Today', value: 0, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917' }}>Gate Dashboard</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Real-time gate management overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {stats.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4, fontFamily: 'Poppins' }}>{card.value}</p>
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
      <h2 style={{ fontFamily: 'Poppins', fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, color: '#1C1917' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <a href="/check-in" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UserPlus size={26} color="#10B981" />
            </div>
            <p style={{ fontWeight: 600, color: '#0F172A' }}>New Visitor Check-in</p>
          </div>
        </a>
        <a href="/visitors" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Users size={26} color="#2563EB" />
            </div>
            <p style={{ fontWeight: 600, color: '#0F172A' }}>View All Visitors</p>
          </div>
        </a>
        <a href="/incidents" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <AlertTriangle size={26} color="#EF4444" />
            </div>
            <p style={{ fontWeight: 600, color: '#0F172A' }}>Report Incident</p>
          </div>
        </a>
      </div>

      {/* Current Time */}
      <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
        <Clock size={32} color="#EF4444" style={{ margin: '0 auto 8px' }} />
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: '#1C1917' }}>{new Date().toLocaleTimeString()}</p>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
}
