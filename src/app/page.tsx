'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, Zap, Lock, Layers, Code, Globe, ArrowRight, Check, Menu, X, Calendar, Eye } from 'lucide-react';

interface PublicContent {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  createdAt: string;
  views: number;
  author: {
    name: string;
  };
  tags?: string[];
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentPosts, setRecentPosts] = useState<PublicContent[]>([]);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch('/api/public/recent');
      const data = await res.json();
      if (data.success) {
        setRecentPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built on Next.js 14 with edge functions for blazing performance"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Flexible Content Types",
      description: "Manage posts, pages, and custom content types effortlessly"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Developer Friendly",
      description: "RESTful API, TypeScript support, and clean architecture"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Deploy Anywhere",
      description: "Works seamlessly with Vercel, Netlify, and other platforms"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure by Default",
      description: "Built-in authentication and MongoDB security best practices"
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      title: "Clean & Simple",
      description: "Intuitive interface that gets out of your way"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Droplet className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Inkdrop CMS</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-400 transition">Features</a>
              <a href="#recent-posts" className="hover:text-blue-400 transition">Recent Posts</a>
              <Link href="/login" className="hover:text-blue-400 transition">Sign In</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block hover:text-blue-400 transition">Features</a>
              <a href="#recent-posts" className="block hover:text-blue-400 transition">Recent Posts</a>
              <Link href="/login" className="block hover:text-blue-400 transition">Sign In</Link>
              <Link href="/register" className="block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-blue-300">Lightweight • Modern • Open Source</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Content Management,
            <br />
            Simplified
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            A lightweight CMS built with Next.js 14 and MongoDB. Perfect for developers who want power without complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2 group">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="/login" className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section id="recent-posts" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Recent Posts</h2>
              <p className="text-slate-400 text-lg">Check out the latest content</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 6).map((post) => (
                <Link
                  key={post._id}
                  href={`/${post.slug}`}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition group"
                >
                  {post.featuredImage && (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{post.author.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Speed & Simplicity</h2>
            <p className="text-slate-400 text-lg">Everything you need, nothing you don't</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Create your account and start managing content in minutes
          </p>
          
          <Link 
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-100 transition font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Droplet className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Inkdrop CMS</span>
          </div>
          <p>Built as part of a 6-month full-stack development journey 🚀</p>
          <p className="mt-2">Open source • MIT License</p>
        </div>
      </footer>
    </div>
  );
}