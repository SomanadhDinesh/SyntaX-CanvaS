import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default hardcoded password for personal access
    if (password === 'admin' || password === 'dinesh' || password === 'secret') {
      onSuccess();
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0C0C0E] border border-zinc-800 rounded min-h-[300px] shadow-2xl z-50 p-8 flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-[#121214] rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="text-xl font-light text-zinc-100 uppercase tracking-widest text-center">System Access</h2>
                <div className="h-1 w-8 bg-blue-500/50 mt-4 rounded-full"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Sequence..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121214] border-b border-zinc-800 px-4 py-3 text-center text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors tracking-[0.3em] font-mono shadow-inner"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <p className="text-red-500 text-xs text-center font-mono uppercase tracking-widest">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-100 text-[#0C0C0E] text-xs font-bold uppercase tracking-[0.2em] rounded hover:bg-white transition-colors"
                >
                  Authenticate
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
