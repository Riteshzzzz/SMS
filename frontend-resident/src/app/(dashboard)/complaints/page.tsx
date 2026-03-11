'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

interface ComplaintItem { id: number; title: string; category: string; priority: string; status: string; date_raised: string; }

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'plumbing', priority: 'medium', location: '' });

  useEffect(() => { api.get('/complaints/').then(r => setComplaints(r.data.results || r.data || [])).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/complaints/', form); api.get('/complaints/').then(r => setComplaints(r.data.results || r.data || [])); setShowForm(false); } catch {}
  };

  const statusBadge = (s: string) => ({ pending: 'badge-warning', acknowledged: 'badge-info', in_progress: 'badge-info', resolved: 'badge-success', closed: 'badge-neutral' }[s] || 'badge-neutral');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B' }}>My Complaints</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>File and track complaints</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> File Complaint
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input className="input-field" placeholder="Complaint Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <textarea className="input-field" placeholder="Describe the issue..." rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="security">Security</option>
                <option value="noise">Noise</option><option value="lift">Lift</option><option value="other">Other</option>
              </select>
              <select className="input-field" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
              <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" className="btn-primary">Submit Complaint</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="table-container">
        <table><thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><MessageSquare size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No complaints filed.</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id}><td style={{ fontWeight: 600 }}>{c.title}</td><td><span className="badge badge-neutral">{c.category}</span></td>
                <td><span className={`badge ${({ low: 'badge-neutral', medium: 'badge-info', high: 'badge-warning', critical: 'badge-error' }[c.priority] || 'badge-neutral')}`}>{c.priority}</span></td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status.replace('_', ' ')}</span></td>
                <td>{new Date(c.date_raised).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
