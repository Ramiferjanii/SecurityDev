'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import type { ThreatReport } from '@/types';
import type { User } from '@/lib/auth';
import Link from 'next/link';
import { LoaderFour } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<ThreatReport | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    checkAuth();
    if (reportId) {
        fetchReportWithRetry();
        fetchComments();
    }
  }, [reportId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchReportWithRetry = async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        const data = await response.json();
        
        if (data.success && data.report) {
          setReport(data.report);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
      // Wait 1 second before retrying
      if (retries > 1) await new Promise(r => setTimeout(r, 1000));
      retries--;
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      router.push(`/login?redirect=/report/${reportId}`);
      return;
    }

    setVoting(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: user.$id }),
      });

      if (response.ok) {
        // Optimistic update or refetch
        fetchReportWithRetry(); 
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          userName: user.name || user.email,
          content: comment.trim(),
        }),
      });

      if (response.ok) {
        setComment('');
        fetchComments(); // Refresh comments list
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getThreatTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      phishing: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/20',
      account_compromise: 'bg-red-500/10 text-red-200 border-red-500/20',
      malware: 'bg-orange-500/10 text-orange-200 border-orange-500/20',
      scam: 'bg-purple-500/10 text-purple-200 border-purple-500/20',
      other: 'bg-gray-500/10 text-gray-200 border-gray-500/20',
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      verified: 'bg-green-500/10 text-green-200 border border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/20',
      false_positive: 'bg-gray-500/10 text-gray-200 border border-gray-500/20',
      resolved: 'bg-blue-500/10 text-blue-200 border border-blue-500/20',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderFour />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
          <h1 className="text-2xl font-bold mb-4 text-white">Report Created Successfully</h1>
          <p className="text-neutral-400 mb-6">Your report has been submitted and is processing. It will appear here shortly.</p>
          <Link href="/reports" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
            ← Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/reports"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block transition-colors"
        >
          ← Back to Reports
        </Link>

        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={cn("px-3 py-1 text-xs font-semibold rounded-full border", getThreatTypeColor(report.type))}>
                  {report.type.toUpperCase()}
                </span>
                <span className={cn("px-3 py-1 text-xs font-semibold rounded-full", getStatusColor(report.status))}>
                  {report.status.toUpperCase()}
                </span>
                {report.verifiedBy && report.verifiedBy.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-green-400 font-medium px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {report.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-xs uppercase">
                    {(report.userName || 'A').charAt(0)}
                </span>
                <span>
                 Reported by <span className="text-white font-medium">{report.userName || 'Anonymous'}</span>
                </span>
                <span>•</span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                {report.confidence && (
                  <>
                   <span>•</span>
                   <span className={cn("font-medium", Number(report.confidence) > 0.8 ? "text-red-400" : "text-yellow-400")}>
                    {Math.round(Number(report.confidence) * 100)}% Confidence
                   </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
              <button
                onClick={() => handleVote('upvote')}
                disabled={voting}
                className="px-4 py-2 hover:bg-green-500/20 text-neutral-300 hover:text-green-300 rounded-full transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                ▲ <span className="text-white">{report.upvotes || 0}</span>
              </button>
              <div className="w-px h-6 bg-white/10"></div>
              <button
                onClick={() => handleVote('downvote')}
                disabled={voting}
                className="px-4 py-2 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 rounded-full transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                ▼ <span className="text-white">{report.downvotes || 0}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {report.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-sm rounded-md transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                Description
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">{report.description}</p>
            </div>
          </div>

          {/* Source */}
          {report.source && (
            <div className="mb-8">
               <h2 className="text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Source / Evidence</h2>
               <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-blue-300 border border-blue-500/20 break-all">
                  {report.source}
               </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-white/10 pt-8 mt-8">
            <h2 className="text-xl font-semibold text-white mb-6">Community Discussion</h2>
            
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-8">
                <div className="relative">
                    <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your analysis or verify this report..."
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    />
                    <div className="absolute bottom-3 right-3">
                        <button
                        type="submit"
                        disabled={submittingComment || !comment.trim()}
                        className="px-4 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-neutral-400 mb-3">Join the discussion to help verify threats.</p>
                <Link
                  href={`/login?redirect=/report/${reportId}`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-500 transition-colors"
                >
                  Sign in to Comment
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {loadingComments ? (
                <div className="text-center text-neutral-400 py-8">
                  <LoaderFour text="Loading comments..." />
                </div>
              ) : comments.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-neutral-500 text-sm">
                  No comments yet. Be the first to verify this report.
                </div>
              ) : (
                comments.map((c: any) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-xs uppercase flex-shrink-0">
                        {(c.userName || 'A').charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{c.userName || 'Anonymous'}</span>
                          <span className="text-neutral-500 text-xs">•</span>
                          <span className="text-neutral-500 text-xs">
                            {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-sm whitespace-pre-wrap break-words">{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
