export interface IContent {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  type: 'post' | 'page' | 'custom';
  status: 'draft' | 'published';
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
}