'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Receipt, Bell, MessageSquare,
  Users, Shield, Dumbbell, Car, Calendar, FileText, BarChart3, LogOut, Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/flats', label: 'Flats', icon: Building2 },
  { href: '/maintenance', label: 'Maintenance', icon: Receipt },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/complaints', label: 'Complaints', icon: MessageSquare },
  { href: '/visitors', label: 'Visitors', icon: Users },
  { href: '/security', label: 'Security', icon: Shield },
  { href: '/amenities', label: 'Amenities', icon: Dumbbell },
  { href: '/parking', label: 'Parking', icon: Car },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: '#0F172A',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ marginBottom: 40, padding: '0 8px' }}>
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Building2 size={28} color="#3B82F6" />
          Society Admin
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 4 }}>Management Portal</p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid #1E293B', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/settings" className="sidebar-link">
          <Settings size={18} />
          Settings
        </Link>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
