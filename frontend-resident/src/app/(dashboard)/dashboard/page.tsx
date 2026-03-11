'use client';
import { motion } from 'framer-motion';
import { Receipt, MessageSquare, Dumbbell, Bell, Users, Car, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function ResidentDashboard() {
  const quickActions = [
    { label: 'View Bills', icon: Receipt, href: '/bills', color: '#10B981', bg: '#ECFDF5' },
    { label: 'File Complaint', icon: MessageSquare, href: '/complaints', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Book Amenity', icon: Dumbbell, href: '/amenities', color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Pre-approve Visitor', icon: Users, href: '/visitors', color: '#2563EB', bg: '#EFF6FF' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 700, color: '#064E3B' }}>Welcome Home 🏠</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Here&apos;s your society at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Due Amount', value: '₹3,000', icon: IndianRupee, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Open Complaints', value: '1', icon: MessageSquare, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Upcoming Bookings', value: '2', icon: Dumbbell, color: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'New Notices', value: '3', icon: Bell, color: '#2563EB', bg: '#EFF6FF' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4, fontFamily: 'Poppins' }}>{card.value}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={card.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'Poppins', fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, color: '#064E3B' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={26} color={action.color} />
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{action.label}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Recent Notices */}
      <h2 style={{ fontFamily: 'Poppins', fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, color: '#064E3B' }}>Recent Notices</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { title: 'Water Supply Interruption', desc: 'Water supply will be interrupted on March 15 from 10 AM to 2 PM for maintenance.', priority: 'high' },
          { title: 'Annual General Meeting', desc: 'AGM scheduled for March 20 at the community hall. All residents are requested to attend.', priority: 'medium' },
          { title: 'Parking Rules Update', desc: 'New parking rules effective from April 1. Please read the updated guidelines.', priority: 'low' },
        ].map((notice, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="glass-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className={`badge ${notice.priority === 'high' ? 'badge-error' : notice.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{notice.priority}</span>
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{notice.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: 4, lineHeight: 1.5 }}>{notice.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
