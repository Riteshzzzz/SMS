'use client';
import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import api from '@/lib/api';

interface AmenityItem { id: number; amenity_name: string; amenity_type: string; capacity: number; charges_per_hour: string; is_active: boolean; operational_hours: string; }

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  useEffect(() => { api.get('/amenities/').then(r => setAmenities(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B', marginBottom: 8 }}>Amenities</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Browse and book society amenities</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {amenities.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: 'span 3', padding: 40, textAlign: 'center', color: '#94A3B8' }}>
            <Dumbbell size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No amenities available yet.
          </div>
        ) : amenities.map(a => (
          <div key={a.id} className="stat-card">
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem' }}>{a.amenity_name}</h3>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 4 }}>{a.amenity_type} · Cap: {a.capacity}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-success">₹{a.charges_per_hour}/hr</span>
              <span className={`badge ${a.is_active ? 'badge-success' : 'badge-error'}`}>{a.is_active ? 'Available' : 'Unavailable'}</span>
            </div>
            <button className="btn-primary" style={{ marginTop: 16, width: '100%', padding: '10px' }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
