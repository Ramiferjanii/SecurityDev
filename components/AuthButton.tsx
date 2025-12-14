'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '@/lib/auth';
import type { User } from '@/lib/auth';
import Link from 'next/link';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-white/50 text-sm animate-pulse">Loading...</div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="px-4 py-2 text-neutral-300 hover:text-white transition-colors text-sm font-medium"
        >
          {user.name || user.email}
        </Link>
        <HoverBorderGradient
            as={Link}
            href="/reports"
            containerClassName="rounded-full"
            className="bg-black/50 text-blue-400 hover:text-blue-300 px-4 py-2 text-sm"
        >
          <span>Community Reports</span>
        </HoverBorderGradient>
        <HoverBorderGradient
            as="button"
            onClick={handleSignOut}
            containerClassName="rounded-full"
            className="bg-red-600/20 text-red-200 hover:bg-red-600/30 px-4 py-2 text-sm transition-colors"
        >
          <span>Sign Out</span>
        </HoverBorderGradient>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <HoverBorderGradient
        as={Link}
        href="/login"
        containerClassName="rounded-full"
        className="bg-black/40 text-neutral-200 hover:text-white px-6 py-2 text-sm"
      >
        <span>Sign In</span>
      </HoverBorderGradient>
      
      <HoverBorderGradient
        as={Link}
        href="/register"
        containerClassName="rounded-full"
        className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 text-sm font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)]"
      >
        <span>Sign Up</span>
      </HoverBorderGradient>
    </div>
  );
}
