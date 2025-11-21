'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentForm from '@/components/ContentForm';

export default function NewContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to create content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Content</h1>
      <ContentForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}