export type Post = {
  id: string;
  title: string;
  topic: string;
  excerpt: string;
  content: string;
  date: string;
  tags?: string[];
  isDraft?: boolean;
};

export type Topic = {
  id: string;
  label: string;
};

export type AppState = {
  posts: Post[];
  topics: Topic[];
  isLoggedIn: boolean;
};
