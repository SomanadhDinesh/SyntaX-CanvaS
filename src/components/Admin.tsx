import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Topic, Post } from '../types';
import { Settings, Plus, Download, Trash2, Edit2, X, Check, Eye } from 'lucide-react';

interface AdminProps {
  topics: Topic[];
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, label: string) => void;
  deleteTopic: (id: string) => void;
  posts: Post[];
  deletePost: (id: string) => void;
  onViewPost: (post: Post) => void;
}

export function Admin({ topics, addTopic, updateTopic, deleteTopic, posts, deletePost, onViewPost }: AdminProps) {
  const [newTopicId, setNewTopicId] = useState('');
  const [newTopicLabel, setNewTopicLabel] = useState('');
  
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicLabel, setEditingTopicLabel] = useState('');
  
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [topicError, setTopicError] = useState<string | null>(null);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    setTopicError(null);
    if (!newTopicId.trim() || !newTopicLabel.trim()) return;

    // Check if ID already exists
    if (topics.some(t => t.id === newTopicId.toLowerCase().trim())) {
      setTopicError("A topic with this ID already exists.");
      return;
    }

    addTopic({
      id: newTopicId.toLowerCase().trim(),
      label: newTopicLabel.trim(),
    });
    setNewTopicId('');
    setNewTopicLabel('');
  };

  const startEditingTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditingTopicLabel(topic.label);
  };

  const handleSaveTopic = (id: string) => {
    if (editingTopicLabel.trim()) {
      updateTopic(id, editingTopicLabel.trim());
    }
    setEditingTopicId(null);
  };

  const handleDeleteTopic = (id: string) => {
    deleteTopic(id);
    setTopicToDelete(null);
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-light text-zinc-100 tracking-tight leading-tight flex items-center">
          <Settings className="w-8 h-8 mr-4 text-blue-500" />
          Dashboard
        </h1>
      </header>

      <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Topics Management Area */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm uppercase font-bold text-zinc-500 tracking-[0.2em] mb-6">Topic Configuration</h2>
            <div className="bg-[#09090A] border border-zinc-800 rounded p-6 space-y-6">
              
              <ul className="space-y-3">
                {topics.map(t => (
                  <li key={t.id} className="flex justify-between items-center text-sm py-2 border-b border-zinc-800/50 last:border-0 group">
                    {editingTopicId === t.id ? (
                      <div className="flex-1 flex items-center space-x-2 mr-4">
                        <input 
                          type="text" 
                          value={editingTopicLabel} 
                          onChange={(e) => setEditingTopicLabel(e.target.value)} 
                          className="flex-1 bg-[#121214] border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTopic(t.id)}
                        />
                        <button onClick={() => handleSaveTopic(t.id)} className="text-zinc-400 hover:text-blue-400 p-1 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingTopicId(null)} className="text-zinc-500 hover:text-zinc-400 p-1 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-zinc-300">{t.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-zinc-600 font-mono text-[10px] bg-zinc-900 px-2 py-1 rounded">{t.id}</span>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {topicToDelete === t.id ? (
                              <>
                                <button onClick={() => handleDeleteTopic(t.id)} className="text-red-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-300">Confirm</button>
                                <button onClick={() => setTopicToDelete(null)} className="text-zinc-500 hover:text-zinc-400"><X className="w-3.5 h-3.5" /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEditingTopic(t)} className="text-zinc-500 hover:text-blue-400 transition-colors">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setTopicToDelete(t.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="h-[1px] w-full bg-zinc-800/50"></div>

              <form onSubmit={handleAddTopic} className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-widest text-zinc-400">Add Subtopic</h3>
                {topicError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded">
                    {topicError}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="ID (e.g. quantum)"
                  value={newTopicId}
                  onChange={(e) => setNewTopicId(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-700/50 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm font-mono"
                  required
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Quantum Computing)"
                  value={newTopicLabel}
                  onChange={(e) => setNewTopicLabel(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-700/50 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-widest rounded hover:bg-blue-500/20 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-2" /> Add Topic
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Data Tools Area */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm uppercase font-bold text-zinc-500 tracking-[0.2em] mb-6">Data Operations</h2>
            <div className="bg-[#09090A] border border-zinc-800 rounded p-6 space-y-6">
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-300">Total Entries</span>
                  <span className="text-4xl font-light text-zinc-100 mt-2">{posts.length}</span>
                </div>
                
                <div className="h-[1px] w-full bg-zinc-800/50 mt-4 mb-4"></div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={exportJSON}
                    className="flex justify-between items-center px-4 py-3 bg-[#121214] border border-zinc-700/50 hover:border-zinc-600 rounded text-zinc-300 hover:text-white transition-colors group text-sm"
                  >
                    <span>Export JSON Backup</span>
                    <Download className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase font-bold text-zinc-500 tracking-[0.2em] mb-6">Post Configuration</h2>
            <div className="bg-[#09090A] border border-zinc-800 rounded p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              <ul className="space-y-3">
                {posts.map(p => (
                  <li key={p.id} className="flex justify-between items-center text-sm py-2 border-b border-zinc-800/50 last:border-0 group cursor-pointer" onClick={() => onViewPost(p)}>
                    <div className="flex flex-col flex-1 mr-4">
                      <span className="text-zinc-300 font-medium truncate group-hover:text-blue-400 transition-colors">{p.title}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{p.topic}</span>
                    </div>
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {postToDelete === p.id ? (
                        <>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            deletePost(p.id);
                            setPostToDelete(null);
                          }} className="text-red-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-300">Confirm</button>
                          <button onClick={(e) => { e.stopPropagation(); setPostToDelete(null); }} className="text-zinc-500 hover:text-zinc-400"><X className="w-3.5 h-3.5" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); onViewPost(p); }} className="text-zinc-500 hover:text-blue-400 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setPostToDelete(p.id); }} className="text-zinc-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
                {posts.length === 0 && (
                  <p className="text-zinc-500 text-xs italic">No entries found.</p>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
