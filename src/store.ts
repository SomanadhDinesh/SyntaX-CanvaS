import { useState, useEffect } from 'react';
import { Post, Topic } from './types';

const INITIAL_TOPICS: Topic[] = [
  { id: 'ai', label: 'AI / Neural' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'cloud', label: 'Cloud / Infra' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Rise of Agentic AI',
    topic: 'ai',
    excerpt: 'Exploring how autonomous agents are reshaping the software landscape.',
    content: 'Autonomous agents have moved from research labs to mainstream applications. This post dives into the architectural patterns and prompt engineering techniques used to build robust agentic flows...',
    date: '2023-10-24',
    tags: ['agents', 'llm', 'architecture'],
  },
  {
    id: '2',
    title: 'Modern Cloud Architecture',
    topic: 'cloud',
    excerpt: 'Serverless, edge computing, and what the future holds for infrastructure.',
    content: 'The cloud landscape is evolving. We are shifting from monolithic deployments to edge-first paradigms. Edge computing brings processing closer to the user, reducing latency...',
    date: '2023-11-02',
    tags: ['serverless', 'edge', 'infrastructure'],
  },
  {
    id: '3',
    title: 'Zero Trust Cybersecurity',
    topic: 'cybersecurity',
    excerpt: 'Why perimeter defense is dead and what you need to implement instead.',
    content: 'In modern networks, you can no longer trust any entity by default. Zero trust models require strict identity verification for every person and device trying to access resources...',
    date: '2023-11-15',
    tags: ['zero-trust', 'security', 'networks'],
  },
  {
    id: '4',
    title: 'Exploring Large Language Models',
    topic: 'ai',
    excerpt: 'A deep dive into the foundation models driving today\'s applications.',
    content: 'LLMs are the engine behind the current AI boom. Understanding their capabilities and limitations is key to using them effectively...',
    date: '2023-12-01',
    tags: ['llm', 'foundations', 'ai'],
  }
];

export function useStore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedPosts = localStorage.getItem('tech_blog_posts');
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (e) {
        setPosts(INITIAL_POSTS);
      }
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('tech_blog_posts', JSON.stringify(INITIAL_POSTS));
    }

    const storedTopics = localStorage.getItem('tech_blog_topics');
    if (storedTopics) {
      try {
        setTopics(JSON.parse(storedTopics));
      } catch (e) {
        setTopics(INITIAL_TOPICS);
      }
    } else {
      setTopics(INITIAL_TOPICS);
      localStorage.setItem('tech_blog_topics', JSON.stringify(INITIAL_TOPICS));
    }
    
    setIsLoggedIn(sessionStorage.getItem('tech_blog_auth') === 'true');
    
    // Simulate initial data fetching delay
    setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('tech_blog_posts', JSON.stringify(newPosts));
  };

  const addPost = (post: Omit<Post, 'id' | 'date'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    savePosts([newPost, ...posts]);
  };

  const updatePost = (id: string, updated: Partial<Post>) => {
    const newPosts = posts.map(p => p.id === id ? { ...p, ...updated } : p);
    savePosts(newPosts);
  };

  const deletePost = (id: string) => {
    const newPosts = posts.filter(p => p.id !== id);
    savePosts(newPosts);
  };

  const addTopic = (topic: Topic) => {
    const newTopics = [...topics, topic];
    setTopics(newTopics);
    localStorage.setItem('tech_blog_topics', JSON.stringify(newTopics));
  };

  const updateTopic = (id: string, label: string) => {
    const newTopics = topics.map(t => t.id === id ? { ...t, label } : t);
    setTopics(newTopics);
    localStorage.setItem('tech_blog_topics', JSON.stringify(newTopics));
  };

  const deleteTopic = (id: string) => {
    const newTopics = topics.filter(t => t.id !== id);
    setTopics(newTopics);
    localStorage.setItem('tech_blog_topics', JSON.stringify(newTopics));
  };

  const login = () => {
    sessionStorage.setItem('tech_blog_auth', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('tech_blog_auth');
    setIsLoggedIn(false);
  };

  return {
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
  };
}
