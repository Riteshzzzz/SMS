'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await login(username, password); router.push('/dashboard'); }
    catch { setError('Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%)', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 48, width: '100%', maxWidth: 440, boxShadow: '0 25px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(239,68,68,0.3)' }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 700, color: '#1C1917' }}>Security Gate</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>Gate Management System</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500 }}>{error}</div>}
          <div><label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 6, display: 'block' }}>Username</label>
            <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required /></div>
          <div><label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px 24px', fontSize: '1rem', marginTop: 8 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </motion.div>
    </div>
  );
}
