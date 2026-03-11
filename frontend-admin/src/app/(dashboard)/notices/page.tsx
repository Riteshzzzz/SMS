'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell } from 'lucide-react';
import api from '@/lib/api';

interface Notice {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  is_pinned: boolean;
  published_date: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium', target_audience: 'all' });

  useEffect(() => {
    api.get('/notices/').then(res => setNotices(res.data.results || res.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/notices/', form);
    api.get('/notices/').then(res => setNotices(res.data.results || res.data || []));
    setShowForm(false);
    setForm({ title: '', description: '', category: 'general', priority: 'medium', target_audience: 'all' });
  };

  const priorityBadge = (p: string) => {
    const map: Record<string, string> = { low: 'badge-neutral', medium: 'badge-info', high: 'badge-warning', urgent: 'badge-error' };
    return map[p] || 'badge-neutral';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>Notices</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Manage society announcements</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Create Notice
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input className="input-field" placeholder="Notice Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <textarea className="input-field" placeholder="Description" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
                <option value="emergency">Emergency</option>
              </select>
              <select className="input-field" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <select className="input-field" value={form.target_audience} onChange={e => setForm({...form, target_audience: e.target.value})}>
                <option value="all">All</option>
                <option value="specific_flats">Specific Flats</option>
                <option value="owners_only">Owners Only</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" className="btn-primary">Publish Notice</button>
            </div>
          </form>
        </motion.div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {notices.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
            <Bell size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
            No notices yet. Create one to get started.
          </div>
        ) : notices.map((notice, i) => (
          <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {notice.is_pinned && <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>📌 Pinned</span>}
                  <span className={`badge ${priorityBadge(notice.priority)}`}>{notice.priority}</span>
                  <span className="badge badge-neutral">{notice.category}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>{notice.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>{notice.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
