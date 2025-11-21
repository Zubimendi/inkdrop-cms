import mongoose, { Schema, Model } from 'mongoose';
import { IContent } from '@/types/content';

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['post', 'page', 'custom'], 
      default: 'post' 
    },
    status: { 
      type: String, 
      enum: ['draft', 'published'], 
      default: 'draft' 
    },
    author: { type: String, default: 'Anonymous' },
  },
  { timestamps: true }
);

const Content: Model<IContent> = 
  mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;