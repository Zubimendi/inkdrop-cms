import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Content from '@/lib/models/Content';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Tag, Droplet } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// This is required for dynamic routes in Next.js 15
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

async function getContentBySlug(slug: string) {
  try {
    await dbConnect();
    const content = await Content.findOne({ slug, status: 'published' });
    
    if (content) {
      // Increment view count
      content.views = (content.views || 0) + 1;
      await content.save();
      
      return JSON.parse(JSON.stringify(content));
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

export default async function PublicContentPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Unwrap params
  const { slug } = await params;
  
  // Fetch content
  const content = await getContentBySlug(slug);

  // If no content found, show 404
  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to home</span>
            </Link>
            
            <Link href="/" className="flex items-center space-x-2">
              <Droplet className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold text-white">Inkdrop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {content.featuredImage && (
          <img
            src={content.featuredImage}
            alt={content.title}
            className="w-full h-96 object-cover rounded-2xl mb-8 shadow-2xl"
          />
        )}

        {/* Meta Info */}
        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {content.author.name[0].toUpperCase()}
            </div>
            <span className="text-white">{content.author.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{content.views} views</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{content.title}</h1>

        {/* Excerpt */}
        {content.excerpt && (
          <p className="text-xl text-slate-300 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6 italic">
            {content.excerpt}
          </p>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {content.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold text-white mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-white mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-bold text-white mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-slate-300 leading-relaxed mb-4 text-lg" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 text-sm" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4 border border-slate-700" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4" {...props} />
              ),
              img: ({ node, ...props }) => (
                <img className="rounded-lg my-6 w-full" {...props} />
              ),
            }}
          >
            {content.content}
          </ReactMarkdown>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
              {content.author.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Written by {content.author.name}</h3>
              <p className="text-slate-400">{content.author.email}</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </article>
    </div>
  );
}