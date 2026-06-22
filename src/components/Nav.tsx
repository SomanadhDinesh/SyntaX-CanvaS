import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Download } from 'lucide-react';
import { Topic, Post } from '../types';

interface NavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentTopic: string | null;
  setCurrentTopic: (topic: string | null) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  topics: Topic[];
  posts: Post[];
}

export function Nav({ 
  currentView, setCurrentView, currentTopic, setCurrentTopic, 
  searchQuery, setSearchQuery, 
  isLoggedIn, onLogin, onLogout, topics, posts 
}: NavProps) {
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    if (view !== 'topics') {
      setCurrentTopic(null);
    }
  };

  const handleTopic = (topicId: string) => {
    setCurrentView('topics');
    setCurrentTopic(topicId);
    setIsMobileMenuOpen(false);
    setIsTopicsOpen(false);
  };

  const exportJSON = () => {
    const jsonString = JSON.stringify(posts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-blog-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="border-b border-zinc-800/50 bg-[#0C0C0E] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-10 py-4 flex items-start justify-between">
        <div 
          className="text-zinc-100 font-bold tracking-tighter text-xl cursor-pointer pt-0.5"
          onClick={() => handleNav('home')}
        >
          KRNL.
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-start">
          <div className="flex items-center space-x-8 pt-1.5">
            {setSearchQuery && (
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded focus:outline-none focus:border-blue-500/50 transition-colors w-40 font-mono"
              />
            )}

            <button 
              onClick={() => handleNav('home')}
              className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${currentView === 'home' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Home
            </button>
            
            <div className="relative group">
              <button 
                className={`flex items-center text-xs uppercase tracking-[0.2em] font-medium transition-colors ${currentView === 'topics' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                onMouseEnter={() => setIsTopicsOpen(true)}
                onMouseLeave={() => setIsTopicsOpen(false)}
              >
                Topics <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <AnimatePresence>
                {isTopicsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-4 w-48 bg-[#121214] border border-zinc-800 py-2 shadow-2xl"
                    onMouseEnter={() => setIsTopicsOpen(true)}
                    onMouseLeave={() => setIsTopicsOpen(false)}
                  >
                    {topics.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleTopic(t.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                      >
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => handleNav('contact')}
              className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${currentView === 'contact' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Contact
            </button>
          </div>

          {isLoggedIn ? (
            <div className="flex flex-col items-start space-y-2 ml-8 pl-8 border-l border-zinc-800">
              <button
                onClick={() => handleNav('editor')}
                className="text-[10px] uppercase tracking-widest font-medium text-blue-500 hover:text-blue-400"
              >
                + New Entry
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
                title="Export JSON"
              >
                <Download className="w-3 h-3 mr-1" /> Export
              </button>
              <button
                onClick={() => handleNav('admin')}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
              >
                Admin
              </button>
              <button
                onClick={onLogout}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end justify-center ml-8 pl-8 border-l border-zinc-800/50 h-[28px] pt-1">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex flex-col items-end">
                  <span>System Online</span>
                  <span className="font-mono text-[9px] mt-0.5">{time}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-800 bg-[#0a0a0a]"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {setSearchQuery && (
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded focus:outline-none focus:border-blue-500/50 transition-colors w-full font-mono mb-2"
                />
              )}
              <button onClick={() => handleNav('home')} className="text-left text-gray-300 text-lg">Home</button>
              <div className="flex flex-col space-y-2">
                <span className="text-left text-gray-500 text-sm font-mono mt-2">TOPICS</span>
                {topics.map(t => (
                  <button key={t.id} onClick={() => handleTopic(t.id)} className="text-left pl-4 text-gray-300">
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => handleNav('contact')} className="text-left text-gray-300 text-lg">Contact</button>
              
              <div className="border-t border-zinc-800/50 pt-4 mt-4 flex flex-col space-y-4">
                {isLoggedIn && (
                  <>
                    <button onClick={() => handleNav('editor')} className="text-left text-blue-500 text-lg">+ New Entry</button>
                    <button onClick={() => handleNav('admin')} className="text-left text-gray-300 text-lg">Admin</button>
                    <button onClick={exportJSON} className="text-left flex-row flex items-center text-gray-300 text-lg"><Download className="w-5 h-5 mr-2" /> Export</button>
                    <button onClick={onLogout} className="text-left text-gray-300 text-lg">Logout</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
