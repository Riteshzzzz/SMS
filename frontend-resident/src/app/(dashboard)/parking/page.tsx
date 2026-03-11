'use client';
import { Car } from 'lucide-react';

export default function ParkingPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B', marginBottom: 8 }}>My Parking</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Your parking slot details</p>
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div className="stat-card">
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Allocated Slot</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', marginTop: 4 }}>P-042</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Vehicle</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', marginTop: 4 }}>MH-12-AB-1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
