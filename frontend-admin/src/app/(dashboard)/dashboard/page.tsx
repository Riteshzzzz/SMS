'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, IndianRupee, MessageSquare, Users, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '@/lib/api';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const collectionData = [
  { month: 'Oct', collected: 280000, pending: 45000 },
  { month: 'Nov', collected: 310000, pending: 38000 },
  { month: 'Dec', collected: 295000, pending: 52000 },
  { month: 'Jan', collected: 320000, pending: 30000 },
  { month: 'Feb', collected: 340000, pending: 25000 },
  { month: 'Mar', collected: 360000, pending: 20000 },
];

const complaintData = [
  { name: 'Plumbing', value: 35 },
  { name: 'Electrical', value: 25 },
  { name: 'Security', value: 15 },
  { name: 'Noise', value: 12 },
  { name: 'Other', value: 13 },
];

const visitorTrend = [
  { day: 'Mon', count: 42 },
  { day: 'Tue', count: 38 },
  { day: 'Wed', count: 55 },
  { day: 'Thu', count: 47 },
  { day: 'Fri', count: 62 },
  { day: 'Sat', count: 78 },
  { day: 'Sun', count: 35 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFlats: 120,
    totalCollection: '₹3,60,000',
    activeComplaints: 8,
    todayVisitors: 24,
  });

  useEffect(() => {
    // Attempt to fetch live data; use defaults on failure
    api.get('/flats/').then(res => {
      setStats(prev => ({ ...prev, totalFlats: res.data.length || res.data.count || 120 }));
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Flats', value: stats.totalFlats, icon: Building2, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Monthly Collection', value: stats.totalCollection, icon: IndianRupee, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Active Complaints', value: stats.activeComplaints, icon: MessageSquare, color: '#F59E0B', bg: '#FFFBEB' },
    { label: "Today's Visitors", value: stats.todayVisitors, icon: Users, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>
          Welcome back! Here&apos;s what&apos;s happening in your society.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4, fontFamily: 'Poppins, sans-serif' }}>
                    {card.value}
                  </p>
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color={card.color} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: '0.75rem' }}>
                <TrendingUp size={14} color="#10B981" />
                <span style={{ color: '#10B981', fontWeight: 600 }}>+12%</span>
                <span style={{ color: '#94A3B8' }}>vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Collection Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: '#0F172A' }}>
            Monthly Collection Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={collectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip />
              <Bar dataKey="collected" fill="#2563EB" radius={[6, 6, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Complaint Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: '#0F172A' }}>
            Complaints by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={complaintData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {complaintData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Visitor Trend + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: '#0F172A' }}>
            Visitor Trend (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visitorTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: '#0F172A' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: CheckCircle, text: 'Payment received from A-101', time: '2 min ago', color: '#10B981' },
              { icon: AlertTriangle, text: 'New complaint: Water leakage B-305', time: '15 min ago', color: '#F59E0B' },
              { icon: Users, text: 'Visitor arrived for C-202', time: '30 min ago', color: '#8B5CF6' },
              { icon: Clock, text: 'Maintenance bill generated for March', time: '1 hr ago', color: '#2563EB' },
              { icon: CheckCircle, text: 'Complaint resolved: Lift issue', time: '2 hrs ago', color: '#10B981' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color={item.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0F172A' }}>{item.text}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: 2 }}>{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
