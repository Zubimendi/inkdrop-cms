"use client";

import { useState } from "react";
import { IContent } from "@/lib/models/Content";
import { Save, Eye, X, Plus, Image as ImageIcon, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface ContentFormProps {
  initialData?: IContent;
  onSubmit: (data: Partial<IContent>) => Promise<void>;
  isLoading?: boolean;
}

export default function ContentForm({
  initialData,
  onSubmit,
  isLoading,
}: ContentFormProps) {
  const [formData, setFormData] = useState<Partial<IContent>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    type: initialData?.type || "post",
    status: initialData?.status || "draft",
    featuredImage: initialData?.featuredImage || "",
    tags: initialData?.tags || [],
    seo: initialData?.seo || { title: "", description: "", keywords: [] },
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    status?: "draft" | "published" | "archived"
  ) => {
    e.preventDefault();
    const dataToSubmit = status ? { ...formData, status } : formData;
    await onSubmit(dataToSubmit);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      seo: {
        ...formData.seo,
        title: title,
      },
    });
  };

  // ✅ Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      // Convert to base64 (no external service needed)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, featuredImage: reader.result as string });
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
      setImageUploading(false);
    }
  };

  const addTag = () => {
    if (currentTag && !formData.tags?.includes(currentTag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), currentTag],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  const addKeyword = () => {
    if (currentKeyword && !formData.seo?.keywords?.includes(currentKeyword)) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...(formData.seo?.keywords || []), currentKeyword],
        },
      });
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo?.keywords?.filter(
          (kw) => kw !== keywordToRemove
        ),
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {initialData ? "Edit Content" : "Create New Content"}
        </h1>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
        >
          <Eye className="w-5 h-5" />
          <span>{showPreview ? "Hide" : "Show"} Preview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* ✅ Preview Mode */}
          {showPreview ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <div className="prose prose-invert max-w-none">
                {formData.featuredImage && (
                  <Image
                    src={formData.featuredImage}
                    alt={formData.title ?? ''} 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-4xl font-bold text-white mb-4">
                  {formData.title || "Untitled"}
                </h1>
                {formData.excerpt && (
                  <p className="text-xl text-slate-400 mb-6">
                    {formData.excerpt}
                  </p>
                )}
                <div className="text-slate-300">
                  <ReactMarkdown>
                    {formData.content || "No content yet..."}
                  </ReactMarkdown>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
              {/* Title */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 text-lg"
                  placeholder="Enter your title..."
                  required
                />
              </div>

              {/* Slug */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Slug *
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">yoursite.com/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 min-h-[400px] font-mono text-sm"
                  placeholder="Write your content here... (Supports Markdown)"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Markdown supported
                </p>
              </div>

              {/* Excerpt */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                  placeholder="Brief summary of your content..."
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  SEO Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                      placeholder="SEO optimized title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo?.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                      placeholder="Meta description for search engines..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Keywords
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                        placeholder="Add keyword..."
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seo?.keywords?.map((keyword, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-1 px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm"
                        >
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 flex-wrap">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isLoading ? "Saving..." : "Save Draft"}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  <Eye className="w-5 h-5" />
                  <span>Publish</span>
                </button>
                {initialData?.status === "published" && (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, "archived")}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    <span>Take Down</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="post">Post</option>
                  <option value="page">Page</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* ✅ Featured Image Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Featured Image
            </h3>

            {formData.featuredImage ? (
              <div className="relative">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, featuredImage: "" })
                  }
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredImage: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 mb-3"
                  placeholder="Or paste image URL..."
                />
                <label className="block border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  {imageUploading ? (
                    <div className="text-blue-400">Uploading...</div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Max 5MB</p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
