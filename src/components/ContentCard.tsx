import Link from 'next/link';
import { IContent } from '@/lib/models/Content';
import { Calendar, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface ContentCardProps {
  content: IContent;
  onDelete: (id: string) => void;
}

export default function ContentCard({ content, onDelete }: ContentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

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
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition">
            {content.title}
          </h3>
          {content.excerpt && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{content.excerpt}</p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
              <Link
                href={`/content/${content._id}`}
                className="flex items-center space-x-2 px-4 py-3 hover:bg-slate-700 text-white transition"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this content?')) {
                    onDelete(content._id!);
                  }
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 px-4 py-3 hover:bg-slate-700 text-red-400 transition w-full"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

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

      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {content.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}