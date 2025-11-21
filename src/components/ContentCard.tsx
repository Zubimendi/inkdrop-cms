'use client';

import Link from 'next/link';
import { IContent } from '@/lib/models/Content';
import { Calendar, Eye, Edit, Trash2, ExternalLink, Copy, Archive } from 'lucide-react';
import { useState } from 'react';

interface ContentCardProps {
  content: IContent;
  onDelete: (id: string) => void;
}

export default function ContentCard({ content, onDelete }: ContentCardProps) {
  const [copied, setCopied] = useState(false);

  const statusColors = {
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    published: 'bg-green-500/10 text-green-400 border-green-500/30',
    archived: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const typeColors = {
    post: 'bg-blue-500/10 text-blue-400',
    page: 'bg-purple-500/10 text-purple-400',
    custom: 'bg-cyan-500/10 text-cyan-400',
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/${content.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${typeColors[content.type]}`}>
              {content.type}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[content.status]}`}>
              {content.status}
            </span>
          </div>
          
          {content.featuredImage && (
            <img 
              src={content.featuredImage} 
              alt={content.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition">
            {content.title}
          </h3>
          {content.excerpt && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{content.excerpt}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(content.createdAt!).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{content.views || 0} views</span>
          </div>
        </div>
      </div>

      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded"
            >
              #{tag}
            </span>
          ))}
          {content.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded">
              +{content.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2 pt-4 border-t border-slate-800">
        <Link
          href={`/content/${content._id}`}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Link>

        {content.status === 'published' && (
          <>
            <Link
              href={`/${content.slug}`}
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              title="View public page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={copyPublicUrl}
              className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              title={copied ? 'Copied!' : 'Copy URL'}
            >
              <Copy className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this content?')) {
              onDelete(content._id!);
            }
          }}
          className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {copied && (
        <div className="mt-2 text-center text-xs text-green-400">
          ✓ URL copied to clipboard!
        </div>
      )}
    </div>
  );
}