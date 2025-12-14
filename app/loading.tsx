'use client';

import React from 'react';
import { LoaderFour } from '@/components/ui/loader';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent backdrop-blur-[2px] z-[9999]">
       <LoaderFour />
    </div>
  );
}
