'use client';
import { useEffect, useState } from 'react';
import { Users, LogOut as LogOutIcon } from 'lucide-react';
import api from '@/lib/api';

interface VisitorItem { id: number; visitor_name: string; contact_no: string; visitor_type: string; flat: number; purpose: string; status: string; check_in_time: string; }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  useEffect(() => { api.get('/visitors/').then(r => setVisitors(r.data.results || r.data || [])).catch(() => {}); }, []);

  const handleCheckout = async (id: number) => {
    await api.post(`/visitors/${id}/checkout/`);
    api.get('/visitors/').then(r => setVisitors(r.data.results || r.data || []));
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>All Visitors</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Visitor log with check-out actions</p>
      <div className="table-container">
        <table><thead><tr><th>Name</th><th>Contact</th><th>Type</th><th>Flat</th><th>Purpose</th><th>Status</th><th>Check-in</th><th>Action</th></tr></thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><Users size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No visitors today.</td></tr>
            ) : visitors.map(v => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600 }}>{v.visitor_name}</td><td>{v.contact_no}</td>
                <td><span className="badge badge-neutral">{v.visitor_type}</span></td><td>#{v.flat}</td><td>{v.purpose}</td>
                <td><span className={`badge ${({ expected: 'badge-info', checked_in: 'badge-success', checked_out: 'badge-neutral', denied: 'badge-error' }[v.status] || 'badge-neutral')}`}>{v.status.replace('_', ' ')}</span></td>
                <td>{v.check_in_time ? new Date(v.check_in_time).toLocaleTimeString() : '-'}</td>
                <td>{v.status === 'checked_in' && <button onClick={() => handleCheckout(v.id)} className="btn-success" style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}><LogOutIcon size={14} />Checkout</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
