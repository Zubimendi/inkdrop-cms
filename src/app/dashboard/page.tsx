'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IContent } from '@/types/content';

export default function Dashboard() {
  const [contents, setContents] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        setContents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const res = await fetch(`/api/content/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContents(contents.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Dashboard</h1>
        <Link
          href="/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Content
        </Link>
      </div>

      <div className="grid gap-4">
        {contents.map((content) => (
          <div key={content._id} className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
                <p className="text-gray-600 text-sm mb-3">/{content.slug}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {content.type}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    content.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {content.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/${content._id}`}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(content._id!)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No content yet. Create your first one!
        </div>
      )}
    </div>
  );
}