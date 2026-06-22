import React from 'react';
import { motion } from 'motion/react';

export function SkeletonPostList() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <header className="mb-12">
        <div className="h-12 bg-zinc-800/50 rounded w-1/3 mb-4 animate-pulse" />
      </header>

      {/* Tag Cloud Skeleton */}
      <div className="mb-12 flex flex-wrap gap-2 pb-8 border-b border-zinc-800/50">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-20 bg-zinc-800/50 rounded animate-pulse" />
        ))}
      </div>

      <div className="space-y-16">
        {[1, 2, 3].map((i) => (
          <article key={i} className="group relative">
            <div className="flex items-baseline space-x-4 mb-3">
              <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-3 w-16 bg-zinc-800/30 rounded animate-pulse" />
            </div>
            
            <div className="h-8 w-3/4 bg-zinc-800/50 rounded mb-4 animate-pulse" />
            <div className="h-4 w-full bg-zinc-800/30 rounded mb-2 animate-pulse" />
            <div className="h-4 w-5/6 bg-zinc-800/30 rounded mb-6 animate-pulse" />
            
            <div className="flex space-x-2">
              <div className="h-3 w-12 bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3 w-16 bg-zinc-800/40 rounded animate-pulse" />
              <div className="h-3 w-14 bg-zinc-800/40 rounded animate-pulse" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
