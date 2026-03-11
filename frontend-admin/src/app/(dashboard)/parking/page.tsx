'use client';
import { useEffect, useState } from 'react';
import { Car } from 'lucide-react';
import api from '@/lib/api';

interface Slot { id: number; slot_number: string; slot_type: string; is_occupied: boolean; vehicle_number: string; vehicle_type: string; monthly_charges: string; }

export default function ParkingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  useEffect(() => { api.get('/parking-slots/').then(r => setSlots(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Parking</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Manage parking slot allocations</p>
      <div className="table-container">
        <table><thead><tr><th>Slot #</th><th>Type</th><th>Vehicle</th><th>Vehicle No</th><th>Charges</th><th>Status</th></tr></thead>
          <tbody>
            {slots.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}><Car size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />No parking slots.</td></tr>
            ) : slots.map(s => (
              <tr key={s.id}><td style={{ fontWeight: 600 }}>{s.slot_number}</td><td>{s.slot_type}</td><td>{s.vehicle_type || '-'}</td><td>{s.vehicle_number || '-'}</td><td>₹{s.monthly_charges}</td><td><span className={`badge ${s.is_occupied ? 'badge-error' : 'badge-success'}`}>{s.is_occupied ? 'Occupied' : 'Available'}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
