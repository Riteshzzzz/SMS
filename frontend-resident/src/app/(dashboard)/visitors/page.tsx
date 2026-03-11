'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import api from '@/lib/api';

interface VisitorItem { id: number; visitor_name: string; contact_no: string; visitor_type: string; purpose: string; status: string; expected_arrival_time: string; }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ visitor_name: '', contact_no: '', visitor_type: 'guest', purpose: '', visiting_person: '', flat: 1 });

  useEffect(() => { api.get('/visitors/').then(r => setVisitors(r.data.results || r.data || [])).catch(() => {}); }, []);

  const handlePreApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/visitors/pre_approve/', form); api.get('/visitors/').then(r => setVisitors(r.data.results || r.data || [])); setShowForm(false); } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B' }}>My Visitors</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Pre-approve and track visitors</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Pre-approve Visitor
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={handlePreApprove} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <input className="input-field" placeholder="Visitor Name" value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} required />
            <input className="input-field" placeholder="Contact No" value={form.contact_no} onChange={e => setForm({...form, contact_no: e.target.value})} required />
            <select className="input-field" value={form.visitor_type} onChange={e => setForm({...form, visitor_type: e.target.value})}>
              <option value="guest">Guest</option><option value="delivery">Delivery</option><option value="service">Service</option><option value="vendor">Vendor</option>
            </select>
            <input className="input-field" placeholder="Purpose" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} required />
            <input className="input-field" placeholder="Visiting Person" value={form.visiting_person} onChange={e => setForm({...form, visiting_person: e.target.value})} required />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" className="btn-primary">Pre-approve</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="table-container">
        <table><thead><tr><th>Name</th><th>Contact</th><th>Type</th><th>Purpose</th><th>Status</th></tr></thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><Users size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No visitor records.</td></tr>
            ) : visitors.map(v => (
              <tr key={v.id}><td style={{ fontWeight: 600 }}>{v.visitor_name}</td><td>{v.contact_no}</td>
                <td><span className="badge badge-neutral">{v.visitor_type}</span></td><td>{v.purpose}</td>
                <td><span className={`badge ${({ expected: 'badge-info', checked_in: 'badge-success', checked_out: 'badge-neutral', denied: 'badge-error' }[v.status] || 'badge-neutral')}`}>{v.status.replace('_', ' ')}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
