'use client';

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

import { signUp } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await signUp(email, password, name);
    
    if (result.success) {
      router.push('/login?registered=true');
    } else {
      setError(result.error || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black/20 backdrop-blur-md border border-white/10">
        <h2 className="text-xl font-bold text-white">
            Join the Community
        </h2>
        <p className="mt-2 text-sm text-white">
            Help protect others by reporting cyber threats.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded text-sm">
                {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
                <Label htmlFor="firstname" className="text-neutral-200 mb-2">Full name</Label>
                <PlaceholdersAndVanishInput
                    placeholders={["Tyler Durden", "Robert Paulson", "Marla Singer"]}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </LabelInputContainer>
            </div>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-neutral-200 mb-2">Email Address</Label>
            <PlaceholdersAndVanishInput
                placeholders={["projectmayhem@fc.com", "tyler@paperstreet.soap", "soap@fc.com"]}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
            />
            </LabelInputContainer>
            
            <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="text-neutral-200 mb-2">Password</Label>
            <PlaceholdersAndVanishInput
                placeholders={["••••••••", "SecurePassword123", "DontTalkAboutIt"]}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
            />
            </LabelInputContainer>

            <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmpassword" className="text-neutral-200 mb-2">Confirm Password</Label>
            <PlaceholdersAndVanishInput
                placeholders={["••••••••", "ConfirmYourSecret", "MatchTheAbove"]}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
            />
            </LabelInputContainer>

            <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
            >
            {loading ? 'Signing up...' : 'Sign up'} &rarr;
            <BottomGradient />
            </button>


            
            <p className="mt-8 text-center text-sm text-neutral-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
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

