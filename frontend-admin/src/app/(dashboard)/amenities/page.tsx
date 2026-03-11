'use client';
import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import api from '@/lib/api';

interface AmenityItem { id: number; amenity_name: string; amenity_type: string; capacity: number; charges_per_hour: string; is_active: boolean; }

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  useEffect(() => { api.get('/amenities/').then(r => setAmenities(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Amenities</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Manage society amenities and bookings</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {amenities.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: 'span 3', padding: 40, textAlign: 'center', color: '#94A3B8' }}>
            <Dumbbell size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No amenities configured.
          </div>
        ) : amenities.map(a => (
          <div key={a.id} className="stat-card">
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1rem' }}>{a.amenity_name}</h3>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 4 }}>{a.amenity_type}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <span className="badge badge-info">Cap: {a.capacity}</span>
              <span className="badge badge-success">₹{a.charges_per_hour}/hr</span>
              <span className={`badge ${a.is_active ? 'badge-success' : 'badge-error'}`}>{a.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
