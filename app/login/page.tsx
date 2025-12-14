'use client';

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";
import { signIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    
    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black/20 backdrop-blur-md border border-white/10">
        <h2 className="text-xl font-bold text-white">
            Welcome Back
        </h2>
        <p className="mt-2 text-sm text-white dark:text-white">
            Sign in to continue protecting the community.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded text-sm">
                {error}
                </div>
            )}

            <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-white mb-2">Email Address</Label>
            <PlaceholdersAndVanishInput
                placeholders={["projectmayhem@fc.com", "tyler@paperstreet.soap", "soap@fc.com"]}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
            />
            </LabelInputContainer>
            
            <LabelInputContainer className="mb-8">
            <Label htmlFor="password" className="text-neutral-200 mb-2">Password</Label>
            <PlaceholdersAndVanishInput
                placeholders={["••••••••", "SecurePassword123", "DontTalkAboutIt"]}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
            />
            </LabelInputContainer>

            <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
            >
            {loading ? 'Signing in...' : 'Sign In'} &rarr;
            <BottomGradient />
            </button>
            
            <p className="mt-8 text-center text-sm text-neutral-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Sign up
                </Link>
            </p>
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

