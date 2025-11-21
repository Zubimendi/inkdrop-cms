'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentForm from '@/components/ContentForm';

export default function NewContentPage() {
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
      <ContentForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}