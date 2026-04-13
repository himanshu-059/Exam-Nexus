import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4 font-serif">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl overflow-hidden border border-[#5A5A40]/10"
      >
        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              layoutId="logo"
              className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <GraduationCap className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-light text-[#1a1a1a] tracking-tight">Exam Nexus</h1>
            <p className="text-[#5A5A40] italic mt-1">Refined Examination Platform</p>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-[#1a1a1a]">Welcome to the Portal</h2>
              <p className="text-sm text-[#5A5A40]/60">Please sign in to access your examinations</p>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center italic"
              >
                {error}
              </motion.p>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5A5A40] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5A5A40]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-[#5A5A40]/20 rounded-lg focus:outline-none focus:border-[#5A5A40] transition-colors bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A5A40] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5A5A40]/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border-2 border-[#5A5A40]/20 rounded-lg focus:outline-none focus:border-[#5A5A40] transition-colors bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5A5A40] text-white py-3 rounded-lg font-medium hover:bg-[#4a4a30] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900 font-semibold mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-800 mb-1">📧 <span className="font-mono">student@exam.com</span></p>
              <p className="text-xs text-blue-800 mb-3">🔑 <span className="font-mono">password123</span></p>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@exam.com');
                  setPassword('admin123');
                }}
                className="text-xs text-blue-700 hover:underline font-medium"
              >
                Or try admin account →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
