'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Building2 } from 'lucide-react';
import api from '@/lib/api';

interface Flat {
  id: number;
  flat_no: string;
  owner_name: string;
  contact_no: string;
  tower_block: string;
  floor_no: number;
  bhk_type: string;
  occupancy_status: string;
  is_active: boolean;
}

export default function FlatsPage() {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editFlat, setEditFlat] = useState<Flat | null>(null);
  const [form, setForm] = useState({
    flat_no: '', owner_name: '', contact_no: '', tower_block: '',
    floor_no: 1, bhk_type: '2BHK', area_sqft: 1000, occupancy_status: 'owner_occupied',
    owner_email: '', alternate_contact: '',
  });

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      const res = await api.get('/flats/');
      setFlats(res.data.results || res.data || []);
    } catch { setFlats([]); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editFlat) {
        await api.put(`/flats/${editFlat.id}/`, form);
      } else {
        await api.post('/flats/', form);
      }
      fetchFlats();
      setShowForm(false);
      setEditFlat(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this flat?')) {
      await api.delete(`/flats/${id}/`);
      fetchFlats();
    }
  };

  const filtered = flats.filter(f =>
    f.flat_no.toLowerCase().includes(search.toLowerCase()) ||
    f.owner_name.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      owner_occupied: 'badge-success',
      rented: 'badge-info',
      vacant: 'badge-warning',
    };
    return map[status] || 'badge-neutral';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
            Flat Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>
            Manage all flats, owners, and tenants
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditFlat(null); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Add Flat
        </button>
      </div>

      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 400 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          className="input-field"
          style={{ paddingLeft: 40 }}
          placeholder="Search flats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, marginBottom: 16 }}>
            {editFlat ? 'Edit Flat' : 'Add New Flat'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <input className="input-field" placeholder="Flat No (e.g. A-101)" value={form.flat_no} onChange={e => setForm({...form, flat_no: e.target.value})} required />
            <input className="input-field" placeholder="Owner Name" value={form.owner_name} onChange={e => setForm({...form, owner_name: e.target.value})} required />
            <input className="input-field" placeholder="Contact No" value={form.contact_no} onChange={e => setForm({...form, contact_no: e.target.value})} required />
            <input className="input-field" placeholder="Tower Block" value={form.tower_block} onChange={e => setForm({...form, tower_block: e.target.value})} required />
            <input className="input-field" type="number" placeholder="Floor No" value={form.floor_no} onChange={e => setForm({...form, floor_no: parseInt(e.target.value)})} />
            <select className="input-field" value={form.bhk_type} onChange={e => setForm({...form, bhk_type: e.target.value})}>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
              <option value="Penthouse">Penthouse</option>
            </select>
            <input className="input-field" type="number" placeholder="Area (sqft)" value={form.area_sqft} onChange={e => setForm({...form, area_sqft: parseInt(e.target.value)})} />
            <select className="input-field" value={form.occupancy_status} onChange={e => setForm({...form, occupancy_status: e.target.value})}>
              <option value="owner_occupied">Owner Occupied</option>
              <option value="rented">Rented</option>
              <option value="vacant">Vacant</option>
            </select>
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" className="btn-primary">{editFlat ? 'Update' : 'Create'} Flat</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Flat No</th>
              <th>Owner</th>
              <th>Contact</th>
              <th>Tower</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                <Building2 size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                No flats found. Add your first flat to get started.
              </td></tr>
            ) : filtered.map(flat => (
              <tr key={flat.id}>
                <td style={{ fontWeight: 600 }}>{flat.flat_no}</td>
                <td>{flat.owner_name}</td>
                <td>{flat.contact_no}</td>
                <td>{flat.tower_block}</td>
                <td>{flat.floor_no}</td>
                <td>{flat.bhk_type}</td>
                <td><span className={`badge ${statusBadge(flat.occupancy_status)}`}>{flat.occupancy_status.replace('_', ' ')}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditFlat(flat); setForm(flat as any); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(flat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
