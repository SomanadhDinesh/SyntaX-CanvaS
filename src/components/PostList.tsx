import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Post } from '../types';
import { Edit2, Hash } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  isLoggedIn: boolean;
  onEdit: (post: Post) => void;
  onView: (post: Post) => void;
  title: string;
  onTagClick?: (tag: string) => void;
  currentTag?: string | null;
}

export function PostList({ posts, isLoggedIn, onEdit, onView, title, onTagClick, currentTag }: PostListProps) {
  
  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || []))).sort();

  const formatPostedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const datePart = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
      // If it doesn't have a time component originally, don't show midnight time
      if (!dateStr.includes('T') || !isLoggedIn) return datePart;
      
      const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${datePart} ${timePart}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Helmet>
        <title>{title === 'All Logs' ? 'Home' : title} | Tech Blog</title>
        <meta name="description" content="A tech blog focusing on modern software, AI, and systems architecture." />
      </Helmet>
      <header className="mb-12">
        <h1 className="text-5xl font-light text-zinc-100 tracking-tight leading-tight mb-4">{title}</h1>
        {currentTag && (
          <div className="flex items-center text-blue-500 font-mono text-sm uppercase tracking-widest mt-2 bg-blue-500/10 w-fit px-3 py-1 rounded">
            Filtered by: #{currentTag}
            <button 
              onClick={() => onTagClick && onTagClick(currentTag)}
              className="ml-4 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
      </header>

      {/* Tag Cloud */}
      {allTags.length > 0 && (
        <div className="mb-12 flex flex-wrap gap-2 pb-8 border-b border-zinc-800/50">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className={`flex items-center text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded transition-colors ${
                currentTag === tag
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-12">
        {posts.map((post, index) => (
          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={post.id} 
            className="group relative cursor-pointer"
            onClick={() => onView(post)}
          >
            <div className="flex items-center space-x-4 mb-2">
              <time className="text-xs text-blue-500 font-mono block">POSTED: {formatPostedDate(post.date)}</time>
              {post.isDraft && (
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-[0.2em] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                  Draft
                </span>
              )}
            </div>
            <h2 className="text-4xl font-light text-zinc-100 mb-4 group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mb-6"></div>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-500 tracking-[0.2em] bg-zinc-900/30 border border-zinc-800 px-3 py-1.5 rounded">
                  {post.topic}
                </span>
                
                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTagClick) onTagClick(tag);
                        }}
                        className="cursor-pointer text-[10px] font-mono text-zinc-500 hover:text-blue-400 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {isLoggedIn && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="flex items-center text-[11px] uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors shrink-0"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
              )}
            </div>
          </motion.article>
        ))}

        {posts.length === 0 && (
          <div className="text-zinc-600 py-12 text-center border border-dashed border-zinc-800 rounded-lg text-sm uppercase tracking-widest">
            No entries found in index.
          </div>
        )}
      </div>
    </div>
  );
}
