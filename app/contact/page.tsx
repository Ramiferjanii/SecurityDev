'use client';

import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl relative z-20">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Support</h1>
            <p className="text-xl text-neutral-300">
                We're here to help. Reach out to our engineering team for assistance.
            </p>
            <div className="mt-8">
                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
