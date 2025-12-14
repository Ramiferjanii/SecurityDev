'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { ThreatReport } from '@/types';
import type { User } from '@/lib/auth';
import Link from 'next/link';
import { LoaderFour } from '@/components/ui/loader';

export default function ReportsPage() {
  const [reports, setReports] = useState<ThreatReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
    fetchReports();
  }, [filter]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/reports' 
        : `/api/reports?type=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reportId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: user.$id }),
      });

      if (response.ok) {
        fetchReports(); // Refresh reports
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getThreatTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      phishing: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      account_compromise: 'bg-red-500/20 text-red-200 border-red-500/30',
      malware: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      scam: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      other: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      verified: 'bg-green-500/20 text-green-200 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      false_positive: 'bg-gray-500/20 text-gray-200 border-gray-500/30',
      resolved: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📋 Community Threat Reports
            </h1>
            <p className="text-blue-100">
              Help protect others by sharing and verifying threat reports
            </p>
          </div>
          {user && (
            <Link
              href="/report/new"
              className="px-6 py-3 bg-blue-600/80 backdrop-blur text-white rounded-lg hover:bg-blue-600 transition-all border border-blue-400/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              + Report Threat
            </Link>
          )}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-white/10 rounded-lg px-4 py-2 bg-black/40 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="bg-zinc-900">All Reports</option>
            <option value="phishing" className="bg-zinc-900">Phishing</option>
            <option value="account_compromise" className="bg-zinc-900">Account Compromise</option>
            <option value="malware" className="bg-zinc-900">Malware</option>
            <option value="scam" className="bg-zinc-900">Scams</option>
            <option value="other" className="bg-zinc-900">Other</option>
          </select>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoaderFour text="Loading Reports..." />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-blue-200 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            No reports found. Be the first to report a threat!
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.$id} className="bg-black/20 backdrop-blur-md rounded-lg p-6 hover:bg-black/30 transition-all border border-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <Link href={`/report/${report.$id}`} className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getThreatTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      {report.verifiedBy && report.verifiedBy.length > 0 && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          ✓ Verified by {report.verifiedBy.length} expert{report.verifiedBy.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-neutral-300 mb-4 line-clamp-2">{report.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {report.tags && report.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 text-neutral-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-neutral-400">
                      By {report.userName || 'Anonymous'} • {new Date(report.createdAt || (report as any).$createdAt || '').toLocaleString()}
                    </div>
                  </Link>
                  <div className="flex flex-col items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleVote(report.$id || '', 'upvote');
                      }}
                      className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/20 transition-colors text-sm font-medium"
                    >
                      ▲ {report.upvotes || 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleVote(report.$id || '', 'downvote');
                      }}
                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                      ▼ {report.downvotes || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

