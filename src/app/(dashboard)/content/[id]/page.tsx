'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentForm from '@/components/ContentForm';
import { IContent } from '@/lib/models/Content';

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [content, setContent] = useState<IContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to update content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!content) {
    return (
      <div className="p-8">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ContentForm initialData={content} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}