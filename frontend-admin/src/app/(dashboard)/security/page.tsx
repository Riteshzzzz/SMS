'use client';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import api from '@/lib/api';

interface Profile { id: number; guard_name: string; employee_id: string; shift: string; contact_no: string; employment_type: string; }

export default function SecurityPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => { api.get('/security-profiles/').then(r => setProfiles(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Security</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Manage security personnel</p>
      <div className="table-container">
        <table><thead><tr><th>Name</th><th>Employee ID</th><th>Shift</th><th>Contact</th><th>Type</th></tr></thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><Shield size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No security profiles.</td></tr>
            ) : profiles.map(p => (
              <tr key={p.id}><td style={{ fontWeight: 600 }}>{p.guard_name}</td><td>{p.employee_id}</td><td><span className="badge badge-info">{p.shift}</span></td><td>{p.contact_no}</td><td>{p.employment_type}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
