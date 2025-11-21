export interface IContent {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: 'post' | 'page' | 'custom';
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    name: string;
    email: string;
  };
  featuredImage?: string;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt?: Date;
  updatedAt?: Date;
}
