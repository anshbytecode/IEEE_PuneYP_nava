import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService, BlogItem } from '../services/blogService';
import { motion } from 'framer-motion';
import { Search, Calendar, User, BookOpen } from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PublicBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
    totalPages: 1
  });

  const fetchBlogs = async (page = 1, searchQuery = search, tagFilter = selectedTag) => {
    try {
      setLoading(true);
      const res = await blogService.getBlogs({
        page,
        limit: pagination.pageSize,
        status: 'Published',
        search: searchQuery || undefined,
        tag: tagFilter || undefined
      });
      if (res.success && res.blogs) {
        setBlogs(res.blogs);
        setPagination({
          current: res.pagination.currentPage,
          pageSize: res.pagination.limit,
          total: res.pagination.totalItems,
          totalPages: res.pagination.totalPages
        });
      }
    } catch (error) {
      console.error('Failed to load blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, [selectedTag]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(1);
  };

  const handlePageChange = (page: number) => {
    fetchBlogs(page);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const commonTags = [
    'Technology',
    'Professional Development',
    'IEEE',
    'Career',
    'Mentorship',
    'Seminar',
    'Workshop'
  ];

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. HERO HEADER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="blogs-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--color-ieee-primary)" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blogs-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen size={12} />
            Publications
          </div>
          <h1 className="text-4xl font-bold text-ieee-dark leading-tight tracking-tight">
            The IEEE Pune YP{' '}
            <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent">
              Blog Portal
            </span>
          </h1>
          <p className="text-gray-500 text-[15px] mt-4 max-w-2xl mx-auto leading-relaxed">
            Read high-quality articles, industry summaries, and community updates written by our leaders and section members.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. FILTERS & SEARCH BAR
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Tags Cloud */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filter Tags:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                selectedTag === null
                  ? 'bg-ieee-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {commonTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                  selectedTag === tag
                    ? 'bg-ieee-blue text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-ieee-blue focus:bg-white transition-all duration-150"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. BLOG CARDS GRID
          ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, idx) => (
                <motion.article
                  key={blog.id}
                  onClick={() => navigate(`/public-blogs/${blog.id}`)}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer flex flex-col h-full"
                  initial={reduced ? {} : { opacity: 0, y: 30 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img
                      src={blog.thumbnailUrl || 'https://via.placeholder.com/600x400?text=IEEE+Blog'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
                      {blog.tags && blog.tags.map((t, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-ieee-light text-ieee-blue">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-ieee-dark leading-snug line-clamp-2 mb-3">
                      {blog.title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto text-xs text-gray-400 shrink-0">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        <span>By {blog.author_name || 'IEEE YP'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 bg-white border border-gray-100 py-3.5 px-6 rounded-full w-fit mx-auto shadow-sm">
                <button
                  disabled={pagination.current === 1}
                  onClick={() => handlePageChange(pagination.current - 1)}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Page {pagination.current} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.current === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.current + 1)}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
