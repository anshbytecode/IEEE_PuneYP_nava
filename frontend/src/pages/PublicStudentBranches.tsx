import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentBranchService, StudentBranch } from '../services/studentBranchService';
import { Search, Mail, Award, Calendar, BookOpen, ChevronDown, X } from 'lucide-react';
import { Spin } from 'antd';

export const PublicStudentBranches: React.FC = () => {
  const [branches, setBranches] = useState<StudentBranch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Load student branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const res = await studentBranchService.getStudentBranches();
        if (res.success && res.branches) {
          setBranches(res.branches);
        }
      } catch (error) {
        console.error('Failed to load branches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Filter branches by search term
  const filteredBranches = useMemo(() => {
    return branches.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.code && b.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [branches, searchTerm]);

  // Handle branch card click to expand
  const handleBranchClick = (branchId: string) => {
    if (selectedBranchId === branchId) {
      setSelectedBranchId(null);
    } else {
      setSelectedBranchId(branchId);
      const branch = branches.find(b => b.id === branchId);
      if (branch && branch.officers && branch.officers.length > 0) {
        const years = Array.from(new Set(branch.officers.map(o => o.year))).sort((a, b) => b - a);
        setSelectedYear(years[0] || 2026);
      } else {
        setSelectedYear(2026);
      }
    }
  };

  const activeBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || null;
  }, [branches, selectedBranchId]);

  const availableYears = useMemo(() => {
    if (!activeBranch || !activeBranch.officers) return [];
    return Array.from(new Set(activeBranch.officers.map(o => o.year))).sort((a, b) => b - a);
  }, [activeBranch]);

  const activeOfficers = useMemo(() => {
    if (!activeBranch || !activeBranch.officers) return [];
    return activeBranch.officers.filter(o => o.year === selectedYear);
  }, [activeBranch, selectedYear]);

  return (
    <div className="relative text-[#F8FAFC] pb-24 w-full">
      {/* ── 1. HERO HEADER ────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center border-b border-white/5 bg-slate-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ieee-teal/15 border border-ieee-teal/25 rounded-full text-ieee-teal text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_12px_rgba(0,178,169,0.1)]">
              <Award size={12} />
              <span>IEEE Pune Section</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
              Student Branches
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans">
              Explore the vibrant network of college student branches registered under the IEEE Pune Section. Click on a college to view their active executive committee and officers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. STATS CARDS ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-ieee-teal/10 text-ieee-teal rounded-xl border border-ieee-teal/20"><Award size={22} /></div>
          <div>
            <div className="text-2xl font-extrabold text-white leading-none font-display">{branches.length || 25}</div>
            <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 tracking-wider">Active Branches</div>
          </div>
        </div>
        <div className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-ieee-teal/10 text-ieee-teal rounded-xl border border-ieee-teal/20"><BookOpen size={22} /></div>
          <div>
            <div className="text-2xl font-extrabold text-white leading-none font-display">15+</div>
            <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 tracking-wider">Engineering Colleges</div>
          </div>
        </div>
        <div className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-ieee-teal/10 text-ieee-teal rounded-xl border border-ieee-teal/20"><Calendar size={22} /></div>
          <div>
            <div className="text-2xl font-extrabold text-white leading-none font-display">2026</div>
            <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 tracking-wider">Active Committee</div>
          </div>
        </div>
      </div>

      {/* ── 3. SEARCH BAR ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search student branches (e.g. PICT, COEP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0b0f19]/60 border border-white/15 focus:border-ieee-teal focus:ring-1 focus:ring-ieee-teal rounded-full text-sm text-white focus:outline-none transition-all placeholder-gray-600 font-semibold"
          />
        </div>
      </div>

      {/* ── 4. BRANCHES GRID / MODAL ──────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-3">
          <Spin size="large" />
          <p className="text-gray-500 font-semibold text-xs">Loading Student Branches...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 hover:border-ieee-teal/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(0,178,169,0.15)] cursor-pointer transition-all flex flex-col justify-between group overflow-hidden"
                onClick={() => handleBranchClick(branch.id)}
              >
                <div className="flex flex-col">
                  {/* Banner */}
                  <div className="h-20 w-full bg-gradient-to-r from-ieee-teal/10 to-purple-650/10 relative shrink-0">
                    {branch.code && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold bg-ieee-teal text-white px-2 py-0.5 rounded uppercase tracking-wider">
                        {branch.code}
                      </span>
                    )}
                  </div>

                  {/* Logo overlay */}
                  <div className="w-16 h-16 rounded-full border border-white/10 shadow bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 -mt-8 ml-6 relative z-10">
                    {branch.logoUrl ? (
                      <img 
                        src={branch.logoUrl} 
                        alt={branch.name} 
                        className="w-full h-full object-contain p-1" 
                      />
                    ) : (
                      <Award className="text-ieee-teal/40" size={24} />
                    )}
                  </div>

                  {/* Body Title */}
                  <div className="p-6 pt-3 flex-grow">
                    <h3 className="text-base font-bold text-white group-hover:text-ieee-teal transition-colors leading-snug line-clamp-2 font-display" title={branch.name}>
                      {branch.name}
                    </h3>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-6 pb-5 pt-3 border-t border-white/5 text-xs text-gray-500 font-semibold flex items-center justify-between">
                  <span>{branch.officers ? `${branch.officers.length} Registered Officers` : '0 Officers'}</span>
                  <div className="flex items-center gap-1 text-ieee-teal group-hover:text-white transition-colors">
                    <span>View ExCom</span>
                    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredBranches.length === 0 && (
            <div className="text-center py-16 bg-[#0b0f19]/45 border border-dashed border-white/10 rounded-2xl max-w-xl mx-auto">
              <Award className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-lg font-bold text-white font-display">No Student Branches Found</h3>
              <p className="text-gray-500 text-xs mt-1">Try resetting your search query.</p>
            </div>
          )}

          {/* Popup ExCom Modal */}
          <AnimatePresence>
            {selectedBranchId && activeBranch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-5xl bg-[#0b0f19]/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col max-h-[85vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedBranchId(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                  >
                    <X size={20} />
                  </button>

                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/5 pr-8">
                    <div>
                      <span className="text-[10px] font-bold text-ieee-teal uppercase tracking-wider bg-ieee-teal/15 px-2.5 py-1 rounded-md">
                        Branch Committee details
                      </span>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2 leading-tight font-display">
                        {activeBranch.name} {activeBranch.code && `(${activeBranch.code})`}
                      </h2>
                    </div>

                    {/* Tabs */}
                    {availableYears.length > 0 && (
                      <div className="flex bg-slate-950/60 border border-white/10 p-1 rounded-xl gap-1 shrink-0">
                        {availableYears.map(year => (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              selectedYear === year
                                ? 'bg-ieee-teal text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Scrollable Body */}
                  <div className="overflow-y-auto pr-2 flex-grow">
                    {activeOfficers.length > 0 ? (
                      <div className="pb-4">
                        <h3 className="text-center text-lg md:text-xl font-extrabold text-white mb-6 tracking-widest uppercase font-display">
                          ExCom Committee ({selectedYear})
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {activeOfficers.map((officer, index) => (
                            <motion.div
                              key={officer.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, delay: index * 0.03 }}
                              className="bg-slate-950/40 border-l-4 border-l-ieee-teal border border-white/5 p-5 rounded-r-xl shadow-lg relative"
                            >
                              <h4 className="text-base font-bold text-white mb-3 font-display">
                                {officer.name}
                              </h4>

                              <div className="space-y-2 text-xs text-gray-300 font-medium">
                                <div>
                                  <span className="text-gray-500">Officer Position:</span>{' '}
                                  <span className="text-white font-bold">{officer.role}</span>
                                </div>
                                
                                <div>
                                  <span className="text-gray-500">IEEE Number:</span>{' '}
                                  <span className="text-white font-bold">
                                    {officer.ieeeNumber || '—'}
                                  </span>
                                </div>

                                {officer.email && (
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-gray-500 shrink-0">Email:</span>{' '}
                                    <a 
                                      href={`mailto:${officer.email}`} 
                                      className="text-ieee-teal hover:text-white underline break-all font-semibold transition-colors"
                                    >
                                      {officer.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-slate-950/40 border border-dashed border-white/5 rounded-2xl text-gray-400">
                        <Mail className="mx-auto text-gray-500 mb-2" size={32} />
                        <h4 className="text-sm font-bold text-gray-300">No Committee Members Registered</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Please populate ExCom details from the Admin Panel.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
