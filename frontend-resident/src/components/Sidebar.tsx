'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, MessageSquare, Users, Dumbbell, Bell, Car, Calendar, FileText, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/bills', label: 'My Bills', icon: Receipt },
  { href: '/complaints', label: 'Complaints', icon: MessageSquare },
  { href: '/visitors', label: 'Visitors', icon: Users },
  { href: '/amenities', label: 'Amenities', icon: Dumbbell },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/parking', label: 'My Parking', icon: Car },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/documents', label: 'Documents', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <aside style={{ width: 260, minHeight: '100vh', background: '#064E3B', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      <div style={{ marginBottom: 40, padding: '0 8px' }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Home size={28} color="#34D399" />
          My Society
        </h1>
        <p style={{ color: '#6EE7B7', fontSize: '0.75rem', marginTop: 4 }}>Resident Portal</p>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
              <Icon size={18} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ borderTop: '1px solid #065F46', paddingTop: 16 }}>
        <button onClick={logout} className="sidebar-link" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
          <LogOut size={18} />Logout
        </button>
      </div>
    </aside>
  );
}
