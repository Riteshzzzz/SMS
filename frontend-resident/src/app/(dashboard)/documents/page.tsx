'use client';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import api from '@/lib/api';

interface Doc { id: number; title: string; category: string; file_type: string; upload_date: string; }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  useEffect(() => { api.get('/documents/').then(r => setDocs(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B', marginBottom: 8 }}>Documents</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Society documents and files</p>
      <div className="table-container">
        <table><thead><tr><th>Title</th><th>Category</th><th>Type</th><th>Uploaded</th></tr></thead>
          <tbody>
            {docs.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><FileText size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No documents available.</td></tr>
            ) : docs.map(d => (
              <tr key={d.id}><td style={{ fontWeight: 600 }}>{d.title}</td><td><span className="badge badge-neutral">{d.category}</span></td><td>{d.file_type}</td><td>{new Date(d.upload_date).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
