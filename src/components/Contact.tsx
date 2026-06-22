import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Twitter, Linkedin, Send } from 'lucide-react';

export function Contact() {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 px-6"
    >
      <header className="mb-12">
        <h1 className="text-5xl font-light text-zinc-100 tracking-tight leading-tight mb-4">Intercept.</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Transmission channel open. Send queries, encrypted payloads, or collaboration requests.
        </p>
      </header>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Identity"
              className="w-full bg-[#09090A] border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500/50 transition-colors font-sans"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Return Address"
              className="w-full bg-[#09090A] border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500/50 transition-colors font-sans"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Payload..."
              className="w-full h-32 bg-[#09090A] border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500/50 transition-colors resize-none font-sans"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full py-3 bg-zinc-100 text-[#09090A] font-bold text-[11px] uppercase tracking-[0.2em] rounded hover:bg-white transition-colors"
          >
            {isSent ? 'Transmitted' : <><Send className="w-3.5 h-3.5 mr-2" /> Transmit Payload</>}
          </button>
        </form>

        <div className="space-y-8 pt-2 md:pt-0">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">Public Keys</h3>
            <div className="space-y-4">
              <a href="mailto:m.somanadhdinesh@gmail.com" className="flex items-center text-zinc-400 hover:text-zinc-100 transition-colors group">
                <div className="w-10 h-10 rounded border border-zinc-800 bg-[#121214] group-hover:border-blue-500/30 group-hover:bg-blue-500/10 flex items-center justify-center mr-4 transition-colors">
                  <Mail className="w-4 h-4 group-hover:text-blue-400 text-zinc-500" />
                </div>
                <span className="text-sm">m.somanadhdinesh@gmail.com</span>
              </a>
              <a href="https://github.com/SomanadhDinesh" target="_blank" rel="noopener noreferrer" className="flex items-center text-zinc-400 hover:text-zinc-100 transition-colors group">
                <div className="w-10 h-10 rounded border border-zinc-800 bg-[#121214] group-hover:border-blue-500/30 group-hover:bg-blue-500/10 flex items-center justify-center mr-4 transition-colors">
                  <Github className="w-4 h-4 group-hover:text-blue-400 text-zinc-500" />
                </div>
                <span className="text-sm">@SomanadhDinesh</span>
              </a>
              <a href="https://www.linkedin.com/in/mallisomanadhdinesh338035346/" target="_blank" rel="noopener noreferrer" className="flex items-center text-zinc-400 hover:text-zinc-100 transition-colors group">
                <div className="w-10 h-10 rounded border border-zinc-800 bg-[#121214] group-hover:border-blue-500/30 group-hover:bg-blue-500/10 flex items-center justify-center mr-4 transition-colors">
                  <Linkedin className="w-4 h-4 group-hover:text-blue-400 text-zinc-500" />
                </div>
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
