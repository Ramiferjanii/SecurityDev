'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import Link from 'next/link';
import { Label } from "@/components/ui/label";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Validating report format" },
  { text: "Analyzing indicators of compromise" },
  { text: "Encrypting data for transport" },
  { text: "Syncing with BLUEFORT database" },
  { text: "Finalizing submission" },
];

export default function NewReportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'phishing' as const,
    title: '',
    description: '',
    source: '',
    tags: '',
    confidence: '0.8',
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login?redirect=/report/new');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      setError('Please sign in to create a report');
      return;
    }

    setSubmissionLoading(true);
    setSubmitting(true);

    // Allow animation to play
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          userName: user.name || user.email,
          userEmail: user.email,
          type: formData.type,
          title: formData.title,
          description: formData.description,
          confidence: parseFloat(formData.confidence),
          tags: tagsArray,
          source: formData.source || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/report/${data.report.$id}`);
      } else {
        setError(data.error || 'Failed to create report');
        setSubmissionLoading(false);
        setSubmitting(false);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create report');
      setSubmissionLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <MultiStepLoader loadingStates={loadingStates} loading={submissionLoading} duration={500} />
      <div className="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black/20 backdrop-blur-md border border-white/10">
        <Link
          href="/reports"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block transition-colors"
        >
          ← Back to Reports
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">
          Report a Threat
        </h1>
        <p className="text-neutral-300 mb-8">
          Help protect the community by sharing information about cyber threats you've encountered.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="type" className="text-neutral-200 mb-2">Threat Type *</Label>
              <div className="relative">
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                  className="w-full h-12 px-4 bg-zinc-800/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="phishing" className="bg-zinc-800">Phishing</option>
                  <option value="account_compromise" className="bg-zinc-800">Account Compromise</option>
                  <option value="malware" className="bg-zinc-800">Malware</option>
                  <option value="scam" className="bg-zinc-800">Scam</option>
                  <option value="other" className="bg-zinc-800">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  ▼
                </div>
              </div>
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="confidence" className="text-neutral-200 mb-2">Confidence Level</Label>
              <div className="relative">
                <select
                  id="confidence"
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                  className="w-full h-12 px-4 bg-zinc-800/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="0.5" className="bg-zinc-800">Low (50%) - Uncertain</option>
                  <option value="0.7" className="bg-zinc-800">Medium (70%) - Likely</option>
                  <option value="0.8" className="bg-zinc-800">High (80%) - Very Likely</option>
                  <option value="0.9" className="bg-zinc-800">Very High (90%) - Confirmed</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  ▼
                </div>
              </div>
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="title" className="text-neutral-200 mb-2">Title *</Label>
            <PlaceholdersAndVanishInput
              placeholders={[
                "Suspicious email from 'Support'",
                "Fake login page for Bank of America",
                "Malware attachment in invoice email",
                "Crypto scam on Discord"
              ]}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              value={formData.title}
            />
            <p className="text-xs text-neutral-400 mt-1">{formData.title.length}/500 characters</p>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="description" className="text-neutral-200 mb-2">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              maxLength={10000}
              placeholder="Provide detailed information about the threat: what happened, what you saw, any suspicious links or emails, etc."
              className="w-full p-4 bg-transparent border-none text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 resize-y rounded-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-white/5 dark:bg-zinc-800/50"
            />
            <p className="text-xs text-neutral-400 mt-1">{formData.description.length}/10000 characters</p>
          </LabelInputContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="source" className="text-neutral-200 mb-2">Source (Optional)</Label>
              <PlaceholdersAndVanishInput
                  placeholders={[
                    "suspicious-site.com",
                    "sender@fake-domain.com",
                    "+1 (555) 000-0000"
                  ]}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  value={formData.source}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="tags" className="text-neutral-200 mb-2">Tags (Optional)</Label>
              <PlaceholdersAndVanishInput
                  placeholders={[
                    "phishing, urgent, bank",
                    "trojan, pdf, invoice",
                    "crypto, investment, scam"
                  ]}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  value={formData.tags}
              />
              <p className="text-xs text-neutral-400 mt-1">Separate tags with commas</p>
            </LabelInputContainer>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-blue-200 font-medium mb-2">
              Tips for a good report:
            </p>
            <ul className="text-sm text-blue-300/80 list-disc list-inside space-y-1">
              <li>Be specific and detailed</li>
              <li>Include any suspicious links or email addresses</li>
              <li>Describe what happened and when</li>
              <li>Add relevant tags to help others find your report</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              className="group/btn relative flex-1 block h-12 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting Report...' : 'Submit Report'} &rarr;
              <BottomGradient />
            </button>
            <Link
              href="/reports"
              className="px-6 py-3 rounded-lg border border-white/10 text-neutral-300 hover:bg-white/5 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

