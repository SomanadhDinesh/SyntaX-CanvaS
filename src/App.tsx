import React, { useState, useEffect } from 'react';
import { Nav } from './components/Nav';
import { PostList } from './components/PostList';
import { PostView } from './components/PostView';
import { Editor } from './components/Editor';
import { Contact } from './components/Contact';
import { LoginModal } from './components/LoginModal';
import { Admin } from './components/Admin';
import { Footer } from './components/Footer';
import { SkeletonPostList } from './components/SkeletonPostList';
import { useStore } from './store';
import { Post } from './types';

export default function App() {
  const { 
    posts,
    topics,
    isLoggedIn, 
    isInitializing, 
    login, 
    logout, 
    addPost, 
    updatePost, 
    deletePost,
    addTopic,
    updateTopic,
    deleteTopic
  } = useStore();

  const [currentView, setCurrentView] = useState('home');
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, viewingPost]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setCurrentView('editor');
  };

  const handleView = (post: Post) => {
    setViewingPost(post);
    setCurrentView('post');
  };

  const handleSave = (postData: Partial<Post>) => {
    if (postData.id) {
      updatePost(postData.id, postData);
    } else {
      addPost(postData as any);
    }
    setCurrentView('home');
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    setCurrentView('home');
    setEditingPost(null);
  };

  let filteredPosts = posts.filter(p => isLoggedIn || !p.isDraft);

  if (currentTopic) {
    filteredPosts = filteredPosts.filter(p => p.topic === currentTopic);
  }

  if (currentTag) {
    filteredPosts = filteredPosts.filter(p => p.tags?.includes(currentTag));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q)
    );
  }

  // View Router
  let content = null;

  if (isInitializing) {
    content = <SkeletonPostList />;
  } else if (currentView === 'home' || currentView === 'topics') {
    let title = currentTopic 
      ? `Logs: ${topics.find(t => t.id === currentTopic)?.label || currentTopic.toUpperCase()}`
      : 'All Logs';
      
    content = (
      <>
        <PostList 
          posts={filteredPosts}
          isLoggedIn={isLoggedIn}
          onEdit={handleEdit}
          onView={handleView}
          title={title}
          onTagClick={setCurrentTag}
          currentTag={currentTag}
        />
      </>
    );
  } else if (currentView === 'post' && viewingPost) {
    content = (
      <PostView 
        post={viewingPost}
        isLoggedIn={isLoggedIn}
        onBack={() => {
          setCurrentView('home');
          setViewingPost(null);
        }}
        onTagClick={(tag) => {
          setCurrentTag(tag);
          setCurrentView('home');
          setViewingPost(null);
        }}
      />
    );
  } else if (currentView === 'contact') {
    content = <Contact />;
  } else if (currentView === 'editor') {
    content = (
      <Editor 
        key={editingPost?.id || 'new'}
        post={editingPost}
        topics={topics}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => {
          setCurrentView('home');
          setEditingPost(null);
        }}
      />
    );
  } else if (currentView === 'admin' && isLoggedIn) {
    content = (
      <Admin 
        topics={topics}
        addTopic={addTopic}
        updateTopic={updateTopic}
        deleteTopic={deleteTopic}
        posts={posts}
        deletePost={deletePost}
        onViewPost={handleView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-300 font-sans selection:bg-blue-500/30 flex flex-col">
      <Nav 
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setEditingPost(null);
          setViewingPost(null);
        }}
        currentTopic={currentTopic}
        setCurrentTopic={(topic) => {
          setCurrentTopic(topic);
          setCurrentTag(null); // Clear tag filter when changing topic
          setViewingPost(null);
          if (currentView === 'post') {
            setCurrentView('home');
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          logout();
          if (currentView === 'admin' || currentView === 'editor') {
            setCurrentView('home');
          }
        }}
        topics={topics}
        posts={posts}
      />
      
      <main className="flex-1 pb-16">
        {content}
      </main>

      {!isLoggedIn && (
        <Footer onSecretTrigger={() => setIsLoginModalOpen(true)} />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          login();
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}
