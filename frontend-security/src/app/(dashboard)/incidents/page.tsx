'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

export default function IncidentsPage() {
  const [form, setForm] = useState({ title: '', description: '', incident_type: 'security_breach', severity: 'medium', location: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/incident-reports/', form); setSuccess(true); setTimeout(() => setSuccess(false), 3000); } catch {}
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>Incident Reports</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Report and track security incidents</p>

      {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✅ Incident reported successfully!</motion.div>}

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={20} color="#EF4444" /> File New Incident</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input className="input-field" placeholder="Incident Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea className="input-field" placeholder="Describe the incident..." rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <select className="input-field" value={form.incident_type} onChange={e => setForm({...form, incident_type: e.target.value})}>
              <option value="security_breach">Security Breach</option><option value="theft">Theft</option><option value="vandalism">Vandalism</option>
              <option value="fire">Fire</option><option value="medical">Medical</option><option value="other">Other</option></select>
            <select className="input-field" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select>
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>Report Incident</button>
          </div>
        </form>
      </div>
    </div>
  );
}
