import mongoose, { Schema, Model } from 'mongoose';

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

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    type: { type: String, enum: ['post', 'page', 'custom'], default: 'post' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    featuredImage: { type: String },
    tags: [{ type: String }],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
export default Content;