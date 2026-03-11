'use client';
import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import api from '@/lib/api';

interface ComplaintItem { id: number; title: string; category: string; priority: string; status: string; date_raised: string; }

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  useEffect(() => { api.get('/complaints/').then(r => setComplaints(r.data.results || r.data || [])).catch(() => {}); }, []);

  const statusBadge = (s: string) => ({ pending: 'badge-warning', acknowledged: 'badge-info', in_progress: 'badge-info', resolved: 'badge-success', closed: 'badge-neutral' }[s] || 'badge-neutral');
  const priBadge = (p: string) => ({ low: 'badge-neutral', medium: 'badge-info', high: 'badge-warning', critical: 'badge-error' }[p] || 'badge-neutral');

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Complaints</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Track and resolve resident complaints</p>
      <div className="table-container">
        <table><thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Raised</th></tr></thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><MessageSquare size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No complaints yet.</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td><span className="badge badge-neutral">{c.category}</span></td>
                <td><span className={`badge ${priBadge(c.priority)}`}>{c.priority}</span></td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status.replace('_', ' ')}</span></td>
                <td>{new Date(c.date_raised).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
