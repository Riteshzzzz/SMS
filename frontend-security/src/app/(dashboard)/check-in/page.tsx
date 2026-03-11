'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function CheckInPage() {
  const [form, setForm] = useState({ visitor_name: '', contact_no: '', visitor_type: 'guest', flat: 1, visiting_person: '', purpose: '', vehicle_type: 'none', vehicle_number: '', entry_gate: 'Main Gate' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/visitors/', form); setSuccess(true); setTimeout(() => setSuccess(false), 3000); setForm({ visitor_name: '', contact_no: '', visitor_type: 'guest', flat: 1, visiting_person: '', purpose: '', vehicle_type: 'none', vehicle_number: '', entry_gate: 'Main Gate' }); } catch {}
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>Visitor Check-in</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Register new visitor entry</p>

      {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✅ Visitor checked in successfully!</motion.div>}

      <div className="glass-card" style={{ padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Visitor Name *</label>
            <input className="input-field" value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Contact No *</label>
            <input className="input-field" value={form.contact_no} onChange={e => setForm({...form, contact_no: e.target.value})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Visitor Type</label>
            <select className="input-field" value={form.visitor_type} onChange={e => setForm({...form, visitor_type: e.target.value})}>
              <option value="guest">Guest</option><option value="delivery">Delivery</option><option value="service">Service</option><option value="vendor">Vendor</option></select></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Flat No *</label>
            <input className="input-field" type="number" value={form.flat} onChange={e => setForm({...form, flat: parseInt(e.target.value)})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Visiting Person *</label>
            <input className="input-field" value={form.visiting_person} onChange={e => setForm({...form, visiting_person: e.target.value})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Purpose *</label>
            <input className="input-field" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Vehicle Type</label>
            <select className="input-field" value={form.vehicle_type} onChange={e => setForm({...form, vehicle_type: e.target.value})}>
              <option value="none">None</option><option value="car">Car</option><option value="bike">Bike</option></select></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Vehicle Number</label>
            <input className="input-field" value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} /></div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 32px' }}>
              <UserPlus size={18} /> Check In Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
