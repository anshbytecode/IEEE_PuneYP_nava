import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService, BlogItem } from '../services/blogService';
import { ArrowLeft, Calendar, User, Mail } from 'lucide-react';

export const PublicBlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogItem | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlogDetails = async () => {
        try {
          setLoading(true);
          const res = await blogService.getBlogById(id);
          if (res.success && res.blog) {
            setBlog(res.blog);
          } else {
            navigate('/public-blogs');
          }
        } catch (err) {
          console.error('Error fetching blog post details:', err);
          navigate('/public-blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlogDetails();
    }
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Safe markdown to HTML parsing helper
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return '';
    let html = markdown;
    
    // Escape standard HTML tags for safety
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-gray-900 mt-6 mb-3">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-4">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-xl font-bold text-ieee-dark mt-10 mb-4">$1</h2>');
    
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Images
    html = html.replace(/\!\[(.*?)\]\((.*?)\)/gim, "<img src='$2' alt='$1' class='w-full max-w-2xl rounded-xl border border-gray-250 my-6 mx-auto block' />");
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' class='text-ieee-blue hover:text-ieee-dark underline decoration-2'>$1</a>");
    
    // Preformatted Code
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-5 rounded-xl font-mono text-sm overflow-x-auto border border-gray-800 my-5">$1</pre>');
    
    // Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-5 text-gray-600 list-disc my-1.5">$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-5 text-gray-600 list-decimal my-1.5">$1</li>');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] bg-gray-50 gap-4">
        <div className="spinner spinner-lg"></div>
        <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Loading article details...</div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. NAVIGATION BACK LINK
          ──────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate('/public-blogs')}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft size={14} className="text-ieee-blue" />
          Back to Blogs
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2. COVER BANNER HERO
          ──────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="relative h-80 md:h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-md">
          <img
            src={blog.thumbnailUrl || 'https://via.placeholder.com/1200x600?text=IEEE+Blog+Banner'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {blog.tags && blog.tags.map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-ieee-blue text-white px-2.5 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
            
            <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight text-shadow">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          3. MAIN ARTICLE LAYOUT
          ──────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <article className="bg-white border border-gray-100 rounded-2xl p-6 md:p-10 shadow-sm">
          {/* Meta header information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-gray-100 pb-5 mb-8 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-ieee-blue shrink-0" />
              <span>Written by <strong>{blog.author_name || 'IEEE Author'}</strong></span>
            </div>
            {blog.author_email && (
              <div className="flex items-center gap-1.5 -mt-2 sm:mt-0">
                <Mail size={14} className="text-ieee-blue shrink-0" />
                <span className="select-all">{blog.author_email}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-ieee-blue shrink-0" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          {/* HTML parsed body content */}
          <div
            className="text-[15px] leading-relaxed text-gray-700 space-y-4"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.content) }}
          />
        </article>
      </main>
    </div>
  );
};
