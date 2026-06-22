import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Post, Topic } from '../types';
import { 
  Wand2, Save, X, Trash2, Check
} from 'lucide-react';

import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

const Font = Quill.import('formats/font') as any;
const customFonts = [
  'arial', 
  'comic-sans',
  'courier-new',
  'georgia',
  'helvetica',
  'lucida',
  'tahoma',
  'times-new-roman',
  'trebuchet',
  'verdana',
  'impact',
  'roboto',
  'open-sans',
  'lato',
  'montserrat'
];
Font.whitelist = customFonts;
Quill.register(Font, true);
Quill.register('modules/blotFormatter', BlotFormatter);

interface EditorProps {
  post: Post | null;
  topics: Topic[];
  onSave: (post: Partial<Post>) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const quillModules = {
  toolbar: [
    [{ 'font': customFonts }, { 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ],
  blotFormatter: {}
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'align',
  'list', 'indent',
  'blockquote', 'code-block',
  'link', 'image', 'video', 'formula'
];

export function Editor({ post, topics, onSave, onDelete, onCancel }: EditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [topic, setTopic] = useState(post?.topic || (topics.length > 0 ? topics[0].id : 'ai'));
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [tagsStr, setTagsStr] = useState(post?.tags?.join(', ') || '');
  const [isDraft, setIsDraft] = useState(post?.isDraft ?? false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const draftKey = `tech_blog_draft_${post?.id || 'new'}`;

  useEffect(() => {
    if (!hasLoadedDraft) {
      const draft = localStorage.getItem(draftKey);
      if (draft && !post) {
        try {
          const parsed = JSON.parse(draft);
          setTitle(parsed.title || '');
          setTopic(parsed.topic || (topics.length > 0 ? topics[0].id : 'ai'));
          setExcerpt(parsed.excerpt || '');
          setContent(parsed.content || '');
          setTagsStr(parsed.tags || '');
          setIsDraft(parsed.isDraft ?? false);
        } catch (e) {
          console.error('Failed to parse draft', e);
        }
      }
      setHasLoadedDraft(true);
    }
  }, [draftKey, post, topics, hasLoadedDraft]);

  useEffect(() => {
    if (hasLoadedDraft) {
      localStorage.setItem(draftKey, JSON.stringify({ title, topic, excerpt, content, tags: tagsStr, isDraft }));
    }
  }, [title, topic, excerpt, content, tagsStr, isDraft, draftKey, hasLoadedDraft]);

  const handleAutoCorrect = async () => {
    if (!content.trim()) return;
    
    setIsCorrecting(true);
    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply corrections.');
      }
      
      if (data.correctedText) {
        setContent(data.correctedText);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to apply corrections.');
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem(draftKey);
    onSave({
      id: post?.id,
      title,
      topic,
      excerpt,
      content,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      isDraft,
    });
  };

  const handleCancel = () => {
    localStorage.removeItem(draftKey);
    onCancel();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-light text-zinc-100 tracking-tight leading-tight">
          {post ? 'Edit Entry' : 'Create Entry'}
        </h1>
        <div className="flex items-center space-x-6 uppercase text-[11px] font-semibold tracking-widest">
          {post && (
            isDeleting ? (
              <>
                <span className="text-zinc-400">Are you sure?</span>
                <button 
                  type="button"
                  onClick={() => onDelete(post.id)}
                  className="text-red-500 hover:text-red-400 flex items-center transition-colors"
                >
                  <Check className="w-3.5 h-3.5 mr-2" />
                  Confirm
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDeleting(false)}
                  className="text-zinc-500 hover:text-zinc-400 flex items-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button 
                type="button"
                onClick={() => setIsDeleting(true)}
                className="text-red-500 hover:text-red-400 flex items-center transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </button>
            )
          )}
          {!isDeleting && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="text-zinc-600 hover:text-zinc-400 flex items-center transition-colors"
            >
              <X className="w-3.5 h-3.5 mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mb-8"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Title Directive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500/50 transition-colors"
              required
            />
          </div>
          <div>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:outline-none focus:border-blue-500/50 appearance-none text-sm uppercase tracking-[0.2em]"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Brief Outline / Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Tags (comma separated)... e.g. neural, model, auth"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors text-sm font-mono"
          />
        </div>

        <div className="relative group text-zinc-900 bg-white rounded overflow-hidden">
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white min-h-[400px]"
          />
        </div>

        <div className="flex justify-between items-center pt-8">
          <label className="flex items-center space-x-2 text-zinc-400 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={isDraft} 
              onChange={e => setIsDraft(e.target.checked)} 
              className="accent-blue-500 w-4 h-4 rounded border-zinc-700 bg-zinc-900"
            />
            <span>Save as Draft</span>
          </label>
          <button
            type="submit"
            className="flex items-center px-8 py-3 bg-zinc-100 text-[#09090A] font-bold text-xs uppercase tracking-[0.2em] rounded hover:bg-white transition-colors border border-transparent"
          >
            <Save className="w-4 h-4 mr-2" />
            {isDraft ? 'Save Draft' : 'Commit Entry'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
