'use client';
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import api from '@/lib/api';

interface VisitorItem { id: number; visitor_name: string; contact_no: string; visitor_type: string; flat: number; purpose: string; status: string; check_in_time: string; }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  useEffect(() => { api.get('/visitors/').then(r => setVisitors(r.data.results || r.data || [])).catch(() => {}); }, []);

  const statusBadge = (s: string) => ({ expected: 'badge-info', checked_in: 'badge-success', checked_out: 'badge-neutral', denied: 'badge-error' }[s] || 'badge-neutral');

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Visitors</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Visitor entry and exit logs</p>
      <div className="table-container">
        <table><thead><tr><th>Name</th><th>Contact</th><th>Type</th><th>Flat</th><th>Purpose</th><th>Status</th><th>Check-in</th></tr></thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><Users size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No visitor records.</td></tr>
            ) : visitors.map(v => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600 }}>{v.visitor_name}</td>
                <td>{v.contact_no}</td>
                <td><span className="badge badge-neutral">{v.visitor_type}</span></td>
                <td>#{v.flat}</td>
                <td>{v.purpose}</td>
                <td><span className={`badge ${statusBadge(v.status)}`}>{v.status.replace('_', ' ')}</span></td>
                <td>{v.check_in_time ? new Date(v.check_in_time).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
