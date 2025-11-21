'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FileText, Eye, Archive, TrendingUp, PlusCircle } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ContentCard from '@/components/ContentCard';
import { IContent } from '@/lib/models/Content';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [contents, setContents] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        setContents(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (contents: IContent[]) => {
    setStats({
      total: contents.length,
      published: contents.filter(c => c.status === 'published').length,
      draft: contents.filter(c => c.status === 'draft').length,
      archived: contents.filter(c => c.status === 'archived').length,
      totalViews: contents.reduce((sum, c) => sum + (c.views || 0), 0),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/content/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContents(contents.filter(c => c._id !== id));
        calculateStats(contents.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name}! 👋
        </h1>
        <p className="text-slate-400">Here's what's happening with your content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Content"
          value={stats.total}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Published"
          value={stats.published}
          icon={Eye}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Drafts"
          value={stats.draft}
          icon={Archive}
          color="yellow"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={TrendingUp}
          color="purple"
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Recent Content */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recent Content</h2>
        <Link
          href="/content/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Content</span>
        </Link>
      </div>

      {contents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
          <p className="text-slate-400 mb-6">Get started by creating your first piece of content</p>
          <Link
            href="/content/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Content</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {contents.slice(0, 5).map((content) => (
            <ContentCard key={content._id} content={content} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}