'use client';
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import api from '@/lib/api';

interface EventItem { id: number; title: string; event_type: string; event_date: string; venue: string; status: string; }

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  useEffect(() => { api.get('/events/').then(r => setEvents(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Events</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Manage society events and gatherings</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {events.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
            <Calendar size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No events scheduled.
          </div>
        ) : events.map(e => (
          <div key={e.id} className="glass-card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{e.title}</h3>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 4 }}>{e.venue} · {new Date(e.event_date).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-neutral">{e.event_type}</span>
              <span className={`badge ${e.status === 'upcoming' ? 'badge-info' : 'badge-success'}`}>{e.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
