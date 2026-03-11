'use client';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Settings</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>Configure system settings</p>
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
        <Settings size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
        Settings configuration coming soon.
      </div>
    </div>
  );
}
