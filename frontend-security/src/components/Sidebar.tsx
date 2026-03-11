'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, Users, AlertTriangle, Clock, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Gate Dashboard', icon: LayoutDashboard },
  { href: '/check-in', label: 'Visitor Check-in', icon: UserPlus },
  { href: '/visitors', label: 'All Visitors', icon: Users },
  { href: '/incidents', label: 'Incident Reports', icon: AlertTriangle },
  { href: '/attendance', label: 'My Attendance', icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  return (
    <aside style={{ width: 260, minHeight: '100vh', background: '#1C1917', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      <div style={{ marginBottom: 40, padding: '0 8px' }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.25rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={28} color="#EF4444" />Security Gate
        </h1>
        <p style={{ color: '#78716C', fontSize: '0.75rem', marginTop: 4 }}>Gate Management</p>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => { const Icon = item.icon; return (
          <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}><Icon size={18} />{item.label}</Link>
        ); })}
      </nav>
      <div style={{ borderTop: '1px solid #292524', paddingTop: 16 }}>
        <button onClick={logout} className="sidebar-link" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><LogOut size={18} />Logout</button>
      </div>
    </aside>
  );
}
