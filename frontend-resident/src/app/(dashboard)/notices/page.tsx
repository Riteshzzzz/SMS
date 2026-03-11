'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import api from '@/lib/api';

interface Notice { id: number; title: string; description: string; category: string; priority: string; is_pinned: boolean; }

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => { api.get('/notices/').then(r => setNotices(r.data.results || r.data || [])).catch(() => {}); }, []);

  const priorityBadge = (p: string) => ({ low: 'badge-neutral', medium: 'badge-info', high: 'badge-warning', urgent: 'badge-error' }[p] || 'badge-neutral');

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B', marginBottom: 8 }}>Notices</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Society announcements and updates</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {notices.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
            <Bell size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No notices posted.
          </div>
        ) : notices.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {n.is_pinned && <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>📌 Pinned</span>}
              <span className={`badge ${priorityBadge(n.priority)}`}>{n.priority}</span>
              <span className="badge badge-neutral">{n.category}</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>{n.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>{n.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
