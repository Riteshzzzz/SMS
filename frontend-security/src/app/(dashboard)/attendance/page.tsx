'use client';
import { Clock, CheckCircle } from 'lucide-react';

export default function AttendancePage() {
  const shifts = [
    { date: 'March 11, 2026', checkIn: '06:00 AM', checkOut: '02:00 PM', hours: '8h 0m', status: 'completed' },
    { date: 'March 10, 2026', checkIn: '06:00 AM', checkOut: '02:00 PM', hours: '8h 0m', status: 'completed' },
    { date: 'March 9, 2026', checkIn: '06:00 AM', checkOut: '02:00 PM', hours: '8h 0m', status: 'completed' },
    { date: 'March 8, 2026', checkIn: '-', checkOut: '-', hours: '-', status: 'off' },
    { date: 'March 7, 2026', checkIn: '06:00 AM', checkOut: '02:00 PM', hours: '8h 0m', status: 'completed' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>My Attendance</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Your shift attendance log</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Shifts</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', marginTop: 4 }}>22</p>
        </div>
        <div className="stat-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Hours</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', marginTop: 4, color: '#10B981' }}>176h</p>
        </div>
        <div className="stat-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Leaves Taken</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Poppins', marginTop: 4, color: '#F59E0B' }}>2</p>
        </div>
      </div>

      <div className="table-container">
        <table><thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>
            {shifts.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.date}</td><td>{s.checkIn}</td><td>{s.checkOut}</td><td>{s.hours}</td>
                <td><span className={`badge ${s.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {s.status === 'completed' && <CheckCircle size={12} />}{s.status}
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
