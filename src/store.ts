import { useState, useEffect } from 'react';
import { Post, Topic } from './types';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const INITIAL_TOPICS: Topic[] = [
  { id: 'ai', label: 'AI / Neural' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'cloud', label: 'Cloud / Infra' },
];

export function useStore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem('tech_blog_auth') === 'true');

    const unsubscribeTopics = onSnapshot(collection(db, 'topics'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_TOPICS.forEach(topic => setDoc(doc(db, 'topics', topic.id), topic));
      } else {
        const dbTopics = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Topic));
        setTopics(dbTopics);
      }
    });

    const unsubscribePosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const dbPosts = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Post))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(dbPosts);
      setIsInitializing(false);
    });

    return () => {
      unsubscribeTopics();
      unsubscribePosts();
    };
  }, []);

  const addPost = async (post: Omit<Post, 'id' | 'date'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    await setDoc(doc(db, 'posts', newPost.id), newPost);
  };

  const updatePost = async (id: string, updated: Partial<Post>) => {
    await setDoc(doc(db, 'posts', id), updated, { merge: true });
  };

  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, 'posts', id));
  };

  const addTopic = async (topic: Topic) => {
    await setDoc(doc(db, 'topics', topic.id), topic);
  };

  const updateTopic = async (id: string, label: string) => {
    await setDoc(doc(db, 'topics', id), { label }, { merge: true });
  };

  const deleteTopic = async (id: string) => {
    await deleteDoc(doc(db, 'topics', id));
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
