"use client";
import { useState } from 'react';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/stateful-button";
import { AnimatePresence, motion } from "motion/react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Hide any previous notifications
    setNotification(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          type: 'success',
          message: '✓ Message sent successfully! We\'ll get back to you soon.',
        });
        // Clear form
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      } else {
        setNotification({
          type: 'error',
          message: `✗ ${data.error || 'Failed to send message. Please try again.'}`,
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: '✗ Network error. Please check your connection and try again.',
      });
    }
  };

  return (
    <div className="relative">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              fixed top-8 left-1/2 -translate-x-1/2 z-50
              px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl
              flex items-center gap-3 min-w-[320px] max-w-md
              ${notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                : 'bg-red-500/10 border-red-500/30 text-red-200'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${notification.type === 'success' 
                ? 'bg-green-500/20' 
                : 'bg-red-500/20'
              }
            `}>
              {notification.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Message */}
            <p className="font-medium flex-1">{notification.message}</p>

            {/* Close Button */}
            <button
              onClick={() => setNotification(null)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
        <p className="text-neutral-300 mb-8">
          Submit specific problems directly to our engineering team.
        </p>

        <form 
          className="space-y-4 max-w-md mx-auto text-left" 
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Name</label>
            <PlaceholdersAndVanishInput
              placeholders={["John Doe", "Jane Smith", "Anonymous User"]}
              onChange={handleChange('name')}
              value={formData.name}
              name="name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Email</label>
            <PlaceholdersAndVanishInput
              placeholders={["john@example.com", "contact@company.com"]}
              onChange={handleChange('email')}
              value={formData.email}
              name="email"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Subject</label>
             <PlaceholdersAndVanishInput
              placeholders={["Bug Report", "Feature Request", "Account Issue"]}
              onChange={handleChange('subject')}
              value={formData.subject}
              name="subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Message</label>
            <textarea
              value={formData.message}
              onChange={handleChange('message')}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div className="pt-2 flex justify-center">
            <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                onClick={(e: any) => handleSubmit(e)}
            >
                Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
