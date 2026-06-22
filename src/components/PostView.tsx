import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Post } from '../types';
import { ArrowLeft, Hash } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css'; // ensure quill styles apply if there are specific classes used

interface PostViewProps {
  post: Post;
  isLoggedIn?: boolean;
  onBack: () => void;
  onTagClick?: (tag: string) => void;
}

export function PostView({ post, isLoggedIn, onBack, onTagClick }: PostViewProps) {
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
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-6"
    >
      <Helmet>
        <title>{post.title} | Tech Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.tags && <meta name="keywords" content={post.tags.join(', ')} />}
      </Helmet>
      
      <button 
        onClick={onBack}
        className="flex items-center text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Logs
      </button>

      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-4">
          <time className="text-xs text-blue-500 font-mono block">POSTED: {formatPostedDate(post.date)}</time>
          {post.isDraft && (
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-[0.2em] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
              Draft
            </span>
          )}
        </div>
        <h1 className="text-5xl font-light text-zinc-100 tracking-tight leading-tight mb-6">{post.title}</h1>
        
        <div className="flex items-center space-x-4 flex-wrap gap-y-2 mb-8">
          <span className="text-[10px] uppercase font-bold text-blue-500 tracking-[0.2em] bg-zinc-900/30 border border-zinc-800 px-3 py-1.5 rounded">
            {post.topic}
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  onClick={() => onTagClick && onTagClick(tag)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded border border-zinc-800 text-zinc-400 ${onTagClick ? 'cursor-pointer hover:text-blue-400 hover:border-blue-500/50 transition-colors' : ''}`}
                >
                  <Hash className="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-xl text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-6">
          {post.excerpt}
        </p>
      </header>

      <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mb-12"></div>

      <div className="prose prose-invert prose-zinc max-w-none">
        <div 
          className="ql-editor p-0 text-zinc-300 leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </motion.article>
  );
}
